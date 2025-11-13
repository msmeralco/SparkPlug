// API utilities for backend communication

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface Barangay {
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
}

export interface EnergyMix {
  solar: {
    capacityKW: number;
    capex: number;
    percentage: number;
  };
  hydro: {
    capacityKW: number;
    capex: number;
    percentage: number;
  };
  wind: {
    capacityKW: number;
    capex: number;
    percentage: number;
  };
  battery: {
    capacityKWh: number;
    capex: number;
  };
  total: {
    capacityKW: number;
    totalCapex: number;
    annualOpex: number;
    coverage: number;
  };
}

export interface Financials {
  totalInvestment: number;
  annualSavings: number;
  paybackYears: number;
  roi20Year: number;
}

export interface ProposalResponse {
  success: boolean;
  proposal: string;
  energyMix: EnergyMix;
  financials: Financials;
  metadata: {
    barangay: string;
    demandMultiplier: number;
    source: "gemini" | "fallback";
    provider: string;
    timestamp: string;
    version: string;
  };
}

export interface ProposalRequest {
  barangay: Barangay;
  demandMultiplier?: number;
  notes?: string;
}

export async function generateProposal(
  request: ProposalRequest
): Promise<ProposalResponse> {
  const endpoint = `${API_BASE_URL}/generate-proposal`;
  console.log("[generateProposal] POST endpoint:", endpoint);
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.error || `API request failed with status ${response.status}`
    );
  }

  return response.json();
}

export async function checkAPIHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      return { status: "unhealthy", available: false };
    }
    const data = await response.json();
    return { ...data, available: true };
  } catch (error) {
    return {
      status: "unreachable",
      available: false,
      error: (error as Error).message,
    };
  }
}
