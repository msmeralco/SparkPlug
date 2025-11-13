import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import dotenv from "dotenv";
import type { NextFunction, Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  FallbackEnergyAdvisor,
  type RenewableDataset,
} from "../lib/fallbackChatbot.js";

// --- NEW TYPES FROM ONBOARDING ---
export interface ApplianceUsage {
  name: string;
  usageIntensity: number; // e.g., hours per day
}

export interface OnboardingData {
  location: string;
  monthlyIncome: number;
  monthlyExpenses: number;
  appliances: ApplianceUsage[];
}

// --- ORIGINAL TYPES ---
type ProviderSource = "gemini" | "knowledge-base";

type Barangay = {
  name: string;
  province: string;
  population: number;
  households: number;
  avgDailyDemandKWh: number;
  solarIrradiance: number;
  hasRiverAccess: boolean;
  avgWindSpeed: number;
  gridConnected: boolean;
  currentElectricityCostPerKWh: number;
};

// --- SERVER SETUP & CONSTANTS ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SERVER_ROOT = path.resolve(__dirname, "../../");

dotenv.config({ path: path.resolve(SERVER_ROOT, ".env") });

const ASSISTANT_NAME = process.env.ASSISTANT_NAME ?? "IslaBot";
const AI_PROVIDER = process.env.AI_PROVIDER ?? "knowledge-base";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const API_KEY = process.env.API_KEY;
const RATE_LIMIT_PER_MINUTE = Number(process.env.RATE_LIMIT_PER_MINUTE ?? 30);

const renewableDataPath = process.env.RENEWABLE_DATA_PATH
  ? path.resolve(SERVER_ROOT, process.env.RENEWABLE_DATA_PATH)
  : path.resolve(SERVER_ROOT, "data/ph_renewable_energy_data.json");

let renewableDataset: RenewableDataset = {};
let fallbackAdvisor: FallbackEnergyAdvisor;

// --- ANALYTICS & RATE LIMITING ---
type RateLimitEntry = {
  count: number;
  resetTime: number;
};

type AnalyticsSnapshot = {
  totalQueries: number;
  popularKeywords: Record<string, number>;
  providerUsage: Record<ProviderSource, number>;
  startTime: string;
};

const analytics: AnalyticsSnapshot = {
  totalQueries: 0,
  popularKeywords: {},
  providerUsage: { gemini: 0, "knowledge-base": 0 },
  startTime: new Date().toISOString(),
};

const rateLimitMap = new Map<string, RateLimitEntry>();

// --- AI & DATA CLIENTS ---
const geminiClient = GEMINI_API_KEY
  ? new GoogleGenerativeAI(GEMINI_API_KEY)
  : null;

// Financial/Technical constants are now passed to the AI
const CONSTANTS = {
  solar: { systemEfficiency: 0.75, capexPerKW: 50000, opexPercentage: 0.02 },
  hydro: { capexPerKW: 120000, opexPercentage: 0.03 },
  wind: { capexPerKW: 85000, opexPercentage: 0.025, minViableSpeed: 4.0 },
  battery: { capexPerKWh: 15000, opexPercentage: 0.02 },
};

// --- DATA LOADING ---
try {
  console.log("GEMINI_API_KEY:", GEMINI_API_KEY ? "Loaded" : "Not Set");
  if (fs.existsSync(renewableDataPath)) {
    const raw = fs.readFileSync(renewableDataPath, "utf8");
    renewableDataset = JSON.parse(raw) as RenewableDataset;
    console.log(`✅ Renewable dataset loaded from ${renewableDataPath}`);
  } else {
    console.warn(`⚠️ Renewable dataset not found at ${renewableDataPath}`);
  }
} catch (error) {
  console.error(
    "❌ Failed to load renewable dataset:",
    (error as Error).message
  );
  renewableDataset = {};
}

fallbackAdvisor = new FallbackEnergyAdvisor(renewableDataset);

const DATASET_SOURCE =
  renewableDataset.metadata?.source ??
  "Philippine Renewable Energy Resource Dataset";

// --- ANALYTICS TRACKING ---
function trackQuery(message: string, source: ProviderSource) {
  analytics.totalQueries += 1;
  analytics.providerUsage[source] = (analytics.providerUsage[source] ?? 0) + 1;

  message
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 3)
    .forEach((word) => {
      analytics.popularKeywords[word] =
        (analytics.popularKeywords[word] ?? 0) + 1;
    });
}

// --- REFINED: CHAT PROMPT ---
/**
 * Creates a personalized chat prompt by including user context.
 */
function createChatPrompt(
  message: string,
  provinceSummary?: string,
  userContext?: OnboardingData // <-- NOW ACCEPTS USER CONTEXT
): string {
  // 1. Create the User Context String
  let userProfileContext =
    "The user is a general visitor inquiring about IslaGrid.";
  if (userContext) {
    const applianceList =
      userContext.appliances.map((a) => a.name).join(", ") || "Not specified";

    userProfileContext = `
---
USER'S ENERGY PROFILE:
- Location: ${userContext.location}
- Stated Monthly Income: ₱${userContext.monthlyIncome.toLocaleString()}
- Disposable Income: ₱${(
      userContext.monthlyIncome - userContext.monthlyExpenses
    ).toLocaleString()}
- Key Appliances: ${applianceList}
---
This profile is CRITICAL. Tailor your entire response to their specific financial and energy situation.
    `;
  }

  // 2. Create the Prompt
  const contextSections = [
    `You are ${ASSISTANT_NAME}, an expert assistant for IslaGrid specializing in Philippine community renewable energy.`,
    userProfileContext, // <-- INJECT THE PERSONAL CONTEXT
    provinceSummary
      ? `Provincial dataset insight for ${
          userContext?.location || "the area"
        }:\n${provinceSummary}`
      : undefined,
    `User question: ${message}`,
    "INSTRUCTIONS:",
    "1. ALWAYS analyze the user's question in the context of their provided ENERGY PROFILE.",
    "2. If they ask about costs, savings, or system size, relate it back to their income and appliance list.",
    "3. Use the Provincial dataset insight to inform resource availability (solar, hydro, wind).",
    "4. Provide clear, actionable, and personalized recommendations.",
  ].filter(Boolean) as string[];

  return contextSections.join("\n\n");
}

// --- GEMINI HELPER ---
async function generateWithGemini(message: string, prompt: string) {
  if (!geminiClient) {
    throw new Error("Gemini client is not configured");
  }

  const model = geminiClient.getGenerativeModel({ model: "gemini-1.5-flash" }); // Using 1.5 Flash
  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  if (!text) {
    throw new Error("Gemini returned an empty response");
  }

  trackQuery(message, "gemini");
  return text.trim();
}

// --- REMOVED: calculateEnergyMix ---
// This logic is now handled by the AI in generateREProposal.

// --- REMOVED: calculateFinancials ---
// This logic is now handled by the AI in generateREProposal.

// --- REFINED: PROPOSAL GENERATION ---
/**
 * Asks the AI to act as an analyst and generate a complete proposal,
 * including the energy mix and financial calculations, based on all
 * provided data.
 */
async function generateREProposal(
  barangay: Barangay,
  userContext: OnboardingData, // <-- NOW ACCEPTS USER CONTEXT
  demandMultiplier: number,
  notes?: string,
  provinceSummary?: string
) {
  if (!geminiClient) {
    throw new Error(
      "Gemini client is not configured. Please set GEMINI_API_KEY and restart the server."
    );
  }

  // Calculate disposable income to help the AI
  const disposableIncome =
    userContext.monthlyIncome - userContext.monthlyExpenses;
  const applianceList =
    userContext.appliances
      .map((a) => `${a.name} (${a.usageIntensity}h/day)`)
      .join(", ") || "Not specified";

  const prompt = `
You are ${ASSISTANT_NAME}, an expert financial and technical analyst for IslaGrid.
Your task is to generate a compelling, professional renewable energy proposal for a community member.

Use the following data blocks to construct your analysis. You must perform the calculations yourself based on the constants provided.

---
1. USER CONTEXT (The Client):
- Location: ${userContext.location} (maps to Barangay: ${barangay.name}, ${
    barangay.province
  })
- Households: ${barangay.households}
- Stated Monthly Income: ₱${userContext.monthlyIncome.toLocaleString()}
- Stated Monthly Expenses: ₱${userContext.monthlyExpenses.toLocaleString()}
- Est. Monthly Disposable Income: ₱${disposableIncome.toLocaleString()}
- Appliances / Load Profile: ${applianceList}
- Current Electricity Cost: ₱${barangay.currentElectricityCostPerKWh}/kWh
- Grid Status: ${
    barangay.gridConnected ? "Grid-Connected" : "Off-Grid/Unreliable"
  }
---

---
2. LOCAL RESOURCES (Based on dataset):
- Province: ${barangay.province}
- Solar Irradiance: ${barangay.solarIrradiance} (High is >5.0, Good is 4.5-5.0)
- River Access (for Micro-Hydro): ${barangay.hasRiverAccess ? "Yes" : "No"}
- Avg. Wind Speed: ${barangay.avgWindSpeed} m/s (Viable > ${
    CONSTANTS.wind.minViableSpeed
  } m/s)
${provinceSummary ? `- Summary: ${provinceSummary}` : ""}
---

---
3. FINANCIAL & TECHNICAL CONSTANTS (For Your Calculations):
- Solar:
  - System Efficiency: ${CONSTANTS.solar.systemEfficiency * 100}%
  - CAPEX: ₱${CONSTANTS.solar.capexPerKW.toLocaleString()}/kW
  - OPEX: ${CONSTANTS.solar.opexPercentage * 100}% of CAPEX
- Hydro (if viable):
  - CAPEX: ₱${CONSTANTS.hydro.capexPerKW.toLocaleString()}/kW
  - OPEX: ${CONSTANTS.hydro.opexPercentage * 100}% of CAPEX
- Wind (if viable):
  - CAPEX: ₱${CONSTANTS.wind.capexPerKW.toLocaleString()}/kW
  - OPEX: ${CONSTANTS.wind.opexPercentage * 100}% of CAPEX
- Battery Storage:
  - CAPEX: ₱${CONSTANTS.battery.capexPerKWh.toLocaleString()}/kWh
  - OPEX: ${CONSTANTS.battery.opexPercentage * 100}% of CAPEX
---

${notes ? `4. SPECIAL REQUIREMENTS: ${notes}` : ""}

---
YOUR TASK:
Write a compelling 4-section proposal. Base ALL calculations on the data provided.

1.  **Executive Summary:** Start by addressing the user's specific context (e.g., "For your community in ${
    userContext.location
  } with a stated disposable income of ₱${disposableIncome.toLocaleString()}..."). Highlight why this proposal is the right choice for their financial and energy goals.

2.  **Recommended Energy Solution:**
    * First, estimate the total daily demand. Use the user's appliances if listed, or fall back to the provided '${
      barangay.avgDailyDemandKWh
    } kWh' (and state this assumption). Apply the \`${demandMultiplier}\` factor to get the final target demand.
    * Based on the 'LOCAL RESOURCES' and 'USER CONTEXT', design an optimal, cost-effective energy mix (Solar, Hydro, Wind).
    * Specify the 'Total Capacity (kW)' for each source and a 'Battery Storage (kWh)' size (e.g., 4-6 hours of average load).
    * Justify *why* you chose this mix (e.g., "Given the strong solar irradiance of ${
      barangay.solarIrradiance
    } and your financial profile, we recommend prioritizing a 10kW solar system...").

3.  **Financial Analysis (Crucial):**
    * Calculate the 'Total System Investment (CAPEX)' using the mix you designed and the provided constants.
    * Calculate the 'Annual Operational Cost (OPEX)'.
    * Calculate the 'Estimated Annual Savings' (Energy Generated * ₱${
      barangay.currentElectricityCostPerKWh
    }/kWh - Annual OPEX).
    * Calculate the 'Simple Payback Period' (Total CAPEX / Annual Savings).
    * Calculate the '20-Year Return on Investment (ROI)'.
    * **Personalize this section:** Discuss the 'Total Investment' in the context of the user's 'Disposable Income' and suggest potential financing models.

4.  **Implementation & Next Steps:**
    * Outline a clear plan (e.g., 1. Detailed Site Survey, 2. Securing Financing, 3. Installation).
    * Highlight how IslaGrid services and community ownership models (like NFC profit cards) align with their goals.
`;

  try {
    const model = geminiClient.getGenerativeModel({
      model: "gemini-1.5-flash",
    });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    if (!text || !text.trim()) {
      throw new Error("Gemini returned an empty response");
    }

    return { text: text.trim(), source: "gemini" as const };
  } catch (error) {
    console.warn(
      "Gemini API failed for proposal generation:",
      (error as Error).message
    );
    throw error;
  }
}

// --- MIDDLEWARE: AUTHENTICATION ---
export function authenticateAPI(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!API_KEY) {
    return next();
  }

  const providedKey = req.headers["x-api-key"] || req.query.apiKey;
  if (providedKey !== API_KEY) {
    return res.status(401).json({ error: "Invalid or missing API key" });
  }

  return next();
}

// --- MIDDLEWARE: RATE LIMITING ---
export function rateLimit(req: Request, res: Response, next: NextFunction) {
  const clientIP = req.ip ?? req.socket.remoteAddress ?? "unknown";
  const now = Date.now();
  const windowMs = 60_000;

  const entry = rateLimitMap.get(clientIP) ?? {
    count: 0,
    resetTime: now + windowMs,
  };

  if (now > entry.resetTime) {
    entry.count = 0;
    entry.resetTime = now + windowMs;
  }

  if (entry.count >= RATE_LIMIT_PER_MINUTE) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    return res.status(429).json({
      error: "Rate limit exceeded. Please try again later.",
      retryAfter,
    });
  }

  entry.count += 1;
  rateLimitMap.set(clientIP, entry);
  return next();
}

// --- REFINED: PROPOSAL HANDLER ---
export async function generateProposalHandler(req: Request, res: Response) {
  try {
    const {
      barangay,
      userContext, // <-- NEW: Receive user's onboarding data
      demandMultiplier = 1.0,
      notes,
    } = req.body as {
      barangay: Barangay;
      userContext: OnboardingData; // <-- NEW
      demandMultiplier?: number;
      notes?: string;
    };

    // --- VALIDATION ---
    if (!barangay || !userContext) {
      return res.status(400).json({
        error: "Barangay data and userContext are required",
        example: {
          barangay: {
            name: "San Isidro",
            province: "Laguna",
            /* ... all barangay fields ... */
          },
          userContext: {
            location: "San Isidro, Laguna",
            monthlyIncome: 30000,
            monthlyExpenses: 20000,
            appliances: [{ name: "Refrigerator", usageIntensity: 24 }],
          },
        },
      });
    }

    const requiredFields = [
      "name",
      "province",
      "population",
      "households",
      "avgDailyDemandKWh",
      "solarIrradiance",
      "currentElectricityCostPerKWh",
    ];
    const missingFields = requiredFields.filter(
      (field) => !(field in barangay)
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required barangay fields: ${missingFields.join(", ")}`,
      });
    }

    // --- REMOVED: Local calculations ---
    // const energyMix = calculateEnergyMix(barangay, demandMultiplier);
    // const financials = calculateFinancials(barangay, energyMix);
    // The AI will generate this as part of the proposal text.

    const provinceRecord = fallbackAdvisor.getProvinceByName(barangay.province);
    const provinceSummary = provinceRecord
      ? fallbackAdvisor.summarizeProvince(provinceRecord)
      : undefined;

    // --- CALL NEW PROMPT GENERATOR ---
    const { text: proposal, source } = await generateREProposal(
      barangay,
      userContext, // <-- PASS USER CONTEXT
      demandMultiplier,
      notes,
      provinceSummary
    );

    const metadata = {
      barangay: `${barangay.name}, ${barangay.province}`,
      demandMultiplier,
      source,
      provider:
        source === "gemini" ? "Google Gemini" : "IslaGrid Knowledge Base",
      timestamp: new Date().toISOString(),
      version: "v1",
      ...(provinceRecord
        ? {
            dataset: {
              province: provinceRecord.province,
              source: DATASET_SOURCE,
            },
          }
        : {}),
    };

    return res.json({
      success: true,
      proposal, // The AI-generated text
      // energyMix and financials are now *inside* the proposal text
      metadata,
    });
  } catch (error) {
    console.error("/generate-proposal error:", error);
    return res.status(500).json({
      error: "Failed to generate proposal",
      message:
        process.env.NODE_ENV === "development"
          ? (error as Error).message
          : undefined,
      timestamp: new Date().toISOString(),
    });
  }
}

// --- REFINED: CHAT HANDLER ---
export async function chatHandler(req: Request, res: Response) {
  try {
    const { message, userContext } = req.body as {
      message?: string;
      userContext?: OnboardingData; // <-- NOW ACCEPTS USER CONTEXT
    };

    if (!message || !message.trim()) {
      return res.status(400).json({
        error: "Message is required",
        example: {
          message: "What renewable energy mix fits my budget?",
          userContext: {
            location: "San Isidro, Laguna",
            monthlyIncome: 30000,
            /* ... */
          },
        },
      });
    }

    const cleanedMessage = message.trim();
    const provinceRecord =
      fallbackAdvisor.getProvinceFromMessage(cleanedMessage);
    const provinceSummary = provinceRecord
      ? fallbackAdvisor.summarizeProvince(provinceRecord)
      : undefined;

    if (AI_PROVIDER === "gemini" && geminiClient) {
      try {
        // Pass userContext to the prompt generator
        const prompt = createChatPrompt(
          cleanedMessage,
          provinceSummary,
          userContext
        );
        const reply = await generateWithGemini(cleanedMessage, prompt);
        return res.json({
          reply,
          source: "gemini",
          provider: "Google Gemini",
          dataset: provinceRecord
            ? { province: provinceRecord.province, source: DATASET_SOURCE }
            : undefined,
          timestamp: new Date().toISOString(),
          version: "v1",
        });
      } catch (geminiError) {
        console.warn("Gemini API failed:", (geminiError as Error).message);
      }
    }

    // Fallback logic (does not use userContext)
    const fallbackResult = fallbackAdvisor.generateResponse(cleanedMessage);
    trackQuery(cleanedMessage, "knowledge-base");

    return res.json({
      reply: fallbackResult.reply,
      source: "knowledge-base",
      provider: "IslaGrid Knowledge Base",
      dataset: fallbackResult.province
        ? {
            province: fallbackResult.province.province,
            source: DATASET_SOURCE,
          }
        : undefined,
      timestamp: new Date().toISOString(),
      version: "v1",
    });
  } catch (error) {
    console.error("/chat error:", error);
    const fallbackResult = fallbackAdvisor.generateResponse(
      req.body?.message ?? ""
    );
    trackQuery(req.body?.message ?? "", "knowledge-base");
    return res.status(500).json({
      reply: fallbackResult.reply,
      // ... (rest of error response) ...
    });
  }
}

// --- HEALTH & ANALYTICS HANDLERS (Unchanged) ---

export function healthHandler(_req: Request, res: Response) {
  return res.json({
    status: "healthy",
    server: "running",
    providers: {
      gemini: Boolean(geminiClient),
      "knowledge-base": true,
    },
    activeProvider:
      AI_PROVIDER === "gemini" && geminiClient ? "gemini" : "knowledge-base",
    dataset: {
      source: DATASET_SOURCE,
      provinces: fallbackAdvisor.getProvinceCount(),
    },
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: "v1",
  });
}

export function analyticsHandler(_req: Request, res: Response) {
  const topKeywords = Object.entries(analytics.popularKeywords)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }));

  return res.json({
    ...analytics,
    topKeywords,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: "v1",
  });
}

// --- REFINED: DOCS HANDLER ---
export function docsHandler(_req: Request, res: Response) {
  return res.json({
    name: "IslaGrid Renewable Energy Planning API",
    version: "v1",
    description:
      "Endpoints for AI-assisted community renewable energy planning, combining Gemini responses with IslaGrid's provincial resource dataset.",
    endpoints: {
      "POST /api/v1/generate-proposal": {
        description:
          "Generate a renewable energy proposal for a barangay using demand, resource, and financial assumptions, personalized to a user's financial profile.",
        parameters: {
          barangay:
            "object (required) - Location and demand profile, including households, daily kWh, and resource indicators",
          userContext:
            "object (required) - User's onboarding profile (location, monthlyIncome, monthlyExpenses, appliances)",
          demandMultiplier:
            "number (optional, default: 1.0) - Scale factor for projected demand",
          notes:
            "string (optional) - Additional planning notes such as land availability or financing goals",
        },
        example: {
          barangay: {
            name: "San Isidro",
            province: "Laguna",
            population: 2500,
            households: 500,
            avgDailyDemandKWh: 3000,
            solarIrradiance: 4.5,
            hasRiverAccess: true,
            avgWindSpeed: 3.2,
            gridConnected: true,
            currentElectricityCostPerKWh: 12.5,
          },
          userContext: {
            location: "San Isidro, Laguna",
            monthlyIncome: 35000,
            monthlyExpenses: 22000,
            appliances: [
              { name: "Refrigerator", usageIntensity: 24 },
              { name: "Air Conditioner", usageIntensity: 8 },
            ],
          },
          demandMultiplier: 1.1,
          notes:
            "Prioritize community-owned solar with river micro-hydro backup",
        },
      },
      "POST /api/v1/chat": {
        description: `Conversational assistant for ${ASSISTANT_NAME}. Can be personalized by providing userContext.`,
        parameters: {
          message: "string (required) - User question or prompt",
          userContext:
            "object (optional) - User's onboarding profile for a personalized response",
        },
        example: {
          message: "What system size can I afford based on my income?",
          userContext: {
            location: "San Isidro, Laguna",
            monthlyIncome: 35000,
            monthlyExpenses: 22000,
            appliances: [{ name: "Refrigerator", usageIntensity: 24 }],
          },
        },
      },
      "GET /api/v1/health": {
        description: "Health and provider status",
      },
      "GET /api/v1/analytics": {
        description: "Keyword and provider usage analytics",
        auth: API_KEY ? "API key required" : "No authentication required",
      },
    },
    // ... (rest of docs) ...
  });
}

// --- ROOT HANDLER (Unchanged) ---
export function rootHandler(req: Request, res: Response) {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  return res.json({
    name: "IslaGrid Renewable Energy Planning API",
    version: "v1",
    status: "running",
    services: [
      "AI conversational assistant for community energy planning",
      "Renewable energy proposal generator",
    ],
    dataset: {
      source: DATASET_SOURCE,
      provinces: fallbackAdvisor.getProvinceCount(),
    },
    documentation: `${baseUrl}/api/v1/docs`,
    health: `${baseUrl}/api/v1/health`,
  });
}
