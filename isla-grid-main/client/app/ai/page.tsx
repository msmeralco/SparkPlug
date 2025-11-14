"use client";

import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import Link from "next/link";
import ChatSidebar from "./components/ChatSidebar";
import ChatHeader from "./components/ChatHeader";
import ChatMessageList from "./components/ChatMessageList";
import ChatInput from "./components/ChatInput";
import OnboardingModal, { OnboardingData } from "@/components/OnboardingModal";
import type { ChatMessage, ConversationPreview } from "./components/types";
import UserRequired from "@/components/routeGuards/UserRequired";
import { useAuth } from "@/providers/authentication";
import { FaRegUserCircle } from "react-icons/fa";
import {
  createUserContext,
  getUserContext,
} from "@/lib/apiEndpoints/userContextsEndpoints";
import {
  deleteChat,
  initializeChat,
  listAllChatsOfUser,
  pushMessageToChat,
} from "@/lib/apiEndpoints/chatEndpoints";
import { Chat, CreateMessageDTO, Message } from "@/types/chatTypes";

const SUGGESTED_PROMPTS = [
  "Generate a personalized home energy proposal based on my profile.",
  "What renewable energy sources are best for my area?",
  "How much can I save with a solar system?",
  "What's the implementation timeline for my home?",
];

// Renewable Energy Data (embedded from ph_renewable_energy_data.json)
const RENEWABLE_ENERGY_DATA = {
  metadata: {
    source: "Philippine Renewable Energy Resource Dataset",
    version: "1.0",
    lastUpdated: "2024-01-01",
  },
  barangays: [
    // Sample data - will be enriched from actual JSON
    {
      name: "San Isidro",
      province: "Laguna",
      population: 2500,
      households: 500,
      avgDailyDemandKWh: 3000,
      solarIrradiance: 4.8,
      hasRiverAccess: true,
      avgWindSpeed: 3.2,
      gridConnected: true,
      currentElectricityCostPerKWh: 12.5,
    },
  ],
};

// Partners Data (embedded from partners.json)
const PARTNERS_DATA = {
  partners: [
    {
      id: 1,
      name: "MSpectrum, Inc.",
      description:
        "End-to-end solar solutions: rooftop solar for C&I, utility-scale EPC, operations & maintenance.",
      location: "Philippines",
      type: "Solar Solutions Provider",
      website: "https://mspectrum.com.ph",
      email: "info@mspectrum.com.ph",
      phone: "+63 (2) 8888-SOLAR",
      services: [
        "Rooftop Solar Installation",
        "Utility-scale EPC",
        "Operations & Maintenance",
        "Consulting",
      ],
    },
    {
      id: 2,
      name: "MGen Renewable Energy (MGreen)",
      description:
        "Large-scale solar development: power plants, solar farms, partner-investments in renewable energy.",
      location: "Philippines",
      type: "Renewable Energy Developer",
      website: "https://mgenrenewable.com.ph",
      email: "business@mgenrenewable.com.ph",
      phone: "+63 (2) 7946-1234",
      services: [
        "Solar Farm Development",
        "Power Plant Construction",
        "Investment Partnerships",
        "Project Financing",
      ],
    },
    {
      id: 3,
      name: "Solar Philippines (SPNEC)",
      description:
        "Utility-scale solar farms and supply agreements, large solar zone developments.",
      location: "Philippines",
      type: "Solar Farm Developer",
      website: "https://www.solarphilippines.com.ph",
      email: "inquiries@solarphilippines.com.ph",
      phone: "+63 (2) 8123-4567",
      services: [
        "Utility-scale Solar Farms",
        "Supply Agreements",
        "Solar Zone Development",
        "Grid Connection Services",
      ],
    },
    {
      id: 4,
      name: "SUMEC",
      description:
        "Certified renewable energy partner providing solar installation and maintenance services.",
      location: "Philippines",
      type: "Solar Installer",
      website: "https://sumec.com.ph",
      email: "support@sumec.com.ph",
      phone: "+63 (2) 5555-SUMEC",
      services: [
        "Solar Installation",
        "Maintenance Services",
        "System Monitoring",
        "Warranty Support",
      ],
    },
  ],
  totalPartners: 4,
  region: "Philippines",
};

// Helper to build renewable energy context
function buildRenewableEnergyContext(): string {
  if (
    !RENEWABLE_ENERGY_DATA.barangays ||
    RENEWABLE_ENERGY_DATA.barangays.length === 0
  ) {
    return "No renewable energy data available.";
  }

  const barangayCount = RENEWABLE_ENERGY_DATA.barangays.length;
  const provinces = [
    ...new Set(RENEWABLE_ENERGY_DATA.barangays.map((b) => b.province)),
  ];
  const avgSolarIrradiance = (
    RENEWABLE_ENERGY_DATA.barangays.reduce(
      (sum, b) => sum + (b.solarIrradiance || 0),
      0
    ) / barangayCount
  ).toFixed(2);

  return `
**RENEWABLE ENERGY DATA CONTEXT:**
- Dataset covers ${barangayCount} barangays across ${
    provinces.length
  } provinces in the Philippines
- Average Solar Irradiance: ${avgSolarIrradiance} kWh/m²/day
- Provinces included: ${provinces.join(", ")}
- This dataset provides localized resource availability (solar, hydro, wind) for different regions
- Use this data to provide location-specific renewable energy recommendations`;
}

// Helper to build partners context
function buildPartnersContext(): string {
  if (!PARTNERS_DATA.partners || PARTNERS_DATA.partners.length === 0) {
    return "No partner data available.";
  }

  const partnersList = PARTNERS_DATA.partners
    .map(
      (partner) => `
- **${partner.name}** (${partner.type})
  - Website: ${partner.website}
  - Email: ${partner.email}
  - Phone: ${partner.phone}
  - Description: ${partner.description}
  - Services: ${partner.services.join(", ")}`
    )
    .join("\n");

  return `
**MERALCO PARTNERS NETWORK - COMPLETE CONTACT DIRECTORY:**
${partnersList}

**PARTNER RECOMMENDATIONS GUIDELINES:**
When recommending implementation partners:
1. Always include the partner's official website link
2. Provide their email for direct inquiries
3. Include phone number for immediate consultation
4. Reference their specific services relevant to the user's needs
5. Format links as clickable markdown: [Partner Name](website-url)
6. Recommend partners based on service type and user location
7. Suggest multiple partners when applicable so user has options
8. Include partner contact information formatted clearly for easy access

**SERVICE MATCHING:**
- Home solar installations: SUMEC, MSpectrum
- Large-scale solar projects: Solar Philippines, MGen Renewable Energy
- End-to-end solutions: MSpectrum, Inc.
- Financing & investments: MGen Renewable Energy (MGreen)`;
}

const AiPage = () => {
  const { user, logout, token } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingLoading, setOnboardingLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [messageInput, setMessageInput] = useState("");
  const [userContext, setUserContext] = useState<OnboardingData | null>(null);

  const [currentConversationId, setCurrentConversationId] = useState("welcome");
  const [conversations, setConversations] = useState<Chat[]>([]);

  // Gemini conversation history for context
  const [conversationHistory, setConversationHistory] = useState<
    Array<{ role: string; parts: Array<{ text: string }> }>
  >([]);

  // loading conversations of the user
  useEffect(() => {
    if (token) {
      const fetchConversations = async () => {
        try {
          const chats = await listAllChatsOfUser(token);

          if (chats.length === 0) {
            await handleCreateConversation();
          } else {
            setConversations(chats);
            setCurrentConversationId(chats[0].chatId);
          }
        } catch (error) {
          console.error("Error fetching conversations:", error);
        }
      };

      fetchConversations();
    }
  }, [token]);

  const displayName =
    user?.displayName || user?.email?.split("@")[0] || "Your Account";
  const email = user?.email;

  // Check if user is already onboarded
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        if (!token) {
          throw new Error("No token found");
        }
        const userContext = await getUserContext(token);
        if (userContext) {
          setUserContext(userContext);
          setShowOnboarding(false);
          initializeGeminiContext(userContext);
        } else {
          setShowOnboarding(true);
        }
      } catch (error) {
        console.error("Failed to check onboarding status:", error);
        setShowOnboarding(true);
      }
    };

    if (user?.uid) {
      checkOnboardingStatus();
    }
  }, [user?.uid, token]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Initialize Gemini context with user data + embedded data
  const initializeGeminiContext = (context: OnboardingData) => {
    const systemPrompt = `You are IslaBot, a specialized renewable energy consultant for the IslaGrid platform.

**USER CONTEXT:**
- **Location:** ${context.location}
- **Monthly Income:** ₱${context.monthlyIncome.toLocaleString()}
- **Appliances/Devices:** ${
      context.appliances.length
    } units (${context.appliances.map((a) => a.name).join(", ")})
- **Onboarded Date:** ${new Date().toLocaleDateString()}

${buildRenewableEnergyContext()}

${buildPartnersContext()}

**YOUR ROLE:**
You provide personalized, data-driven renewable energy solutions specifically tailored to this user's home energy needs. You:
1. Understand their energy consumption patterns based on their appliances
2. Recommend optimal renewable energy systems (Solar, Wind, Hydro, Biomass)
3. Calculate accurate financial projections (ROI, payback periods, savings)
4. Provide implementation timelines and next steps
5. Answer questions about renewable energy technologies
6. Suggest financing options based on their income
7. Reference location-specific data from the renewable energy dataset
8. Recommend IslaGrid partners when applicable

**IMPORTANT GUIDELINES:**
- Always reference their specific context (location, income, appliances)
- Use Philippine peso (₱) for all financial calculations
- Assume electricity rate of ₱12.5/kWh unless stated otherwise
- Be conversational but professional
- Provide specific, actionable recommendations with calculations
- Include assumptions and reasoning in your responses
- Consider local climate and resource availability for ${context.location}
- Use **bold text** for important terms and values
- Structure proposals in clear markdown sections with headers
- When recommending partners, explain how their services benefit the user

**RESPONSE FORMAT:**
- Use headers for main sections (# for h1, ## for h2, ### for h3)
- Use **bold text** for emphasis and key values
- Use bullet points for lists
- Include calculations and ROI projections when relevant
- Provide step-by-step implementation plans`;

    setConversationHistory([
      {
        role: "user",
        parts: [{ text: systemPrompt }],
      },
      {
        role: "model",
        parts: [
          {
            text: `I understand my role. I'm IslaBot, your personalized renewable energy consultant for **${
              context.location
            }**. 

Based on your profile:
- Monthly Income: **₱${context.monthlyIncome.toLocaleString()}**
- Current Appliances: **${context.appliances.length} units**

I have access to:
- **Renewable energy data** for ${
              RENEWABLE_ENERGY_DATA.barangays.length
            } barangays across the Philippines
- **Certified IslaGrid partners** specializing in solar, hydro, and wind solutions
- **Financial tools** to calculate ROI, payback periods, and savings potential

I'm ready to help you design the perfect renewable energy solution for your home. What would you like to know about renewable energy options, costs, or implementation?`,
          },
        ],
      },
    ]);
  };

  const handleSelectConversation = (conversationId: string) => {
    setCurrentConversationId(conversationId);
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleCreateConversation = async () => {
    if (!token) {
      alert("Please log in to create a new conversation.");
      return;
    }

    try {
      const newConversation = await initializeChat(token);
      const defaultMessage: CreateMessageDTO = {
        content:
          "Hello! I am **IslaBot**, your personalized renewable energy consultant. I'm here to help you design the perfect home energy solution based on your location, income, and appliances. What would you like to know?",
        sender: "bot",
      };
      await pushMessageToChat(token, newConversation.chatId, defaultMessage);

      const newConversations = await listAllChatsOfUser(token);

      setConversations(newConversations);
      setCurrentConversationId(newConversation.chatId);
      setMessageInput("");
      if (typeof window !== "undefined" && window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  const handleDeleteConversation = async (conversationId: string) => {
    if (!token) {
      alert("Please log in to delete a conversation.");
      return;
    }

    try {
      await deleteChat(token, conversationId);

      const newConversations = await listAllChatsOfUser(token);
      if (newConversations.length > 0) {
        setCurrentConversationId(newConversations[0].chatId);
      }
      setMessageInput("");

      setConversations(newConversations);
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  // Call Gemini API with embedded context
  const callGeminiAPI = async (userMessage: string): Promise<string> => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

      if (!apiKey) {
        throw new Error("Gemini API key not configured");
      }

      // Add user message to history
      const updatedHistory = [
        ...conversationHistory,
        {
          role: "user",
          parts: [{ text: userMessage }],
        },
      ];

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: updatedHistory,
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `API error: ${errorData.error?.message || response.statusText}`
        );
      }

      const data = await response.json();
      const assistantMessage =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I couldn't generate a response. Please try again.";

      // Update conversation history with assistant response
      setConversationHistory([
        ...updatedHistory,
        {
          role: "model",
          parts: [{ text: assistantMessage }],
        },
      ]);

      return assistantMessage;
    } catch (error) {
      console.error("Gemini API error:", error);
      throw error;
    }
  };

  const handleSendMessage = async () => {
    if (messageInput.trim().length === 0 || isLoading) {
      return;
    }
    console.log("messageInput", messageInput);

    const conversationId = currentConversationId;

    const newMessageDTO: CreateMessageDTO = {
      content: messageInput.trim(),
      sender: "user",
    };

    if (!token) {
      alert("Please log in to send a message.");
      return;
    }

    try {
      await pushMessageToChat(token, conversationId, newMessageDTO);

      const updatedChats = await listAllChatsOfUser(token);
      setConversations(updatedChats);

      setMessageInput("");
      setIsLoading(true);

      // Call Gemini API with user message and embedded context
      const assistantResponse = await callGeminiAPI(newMessageDTO.content);

      const formattedMessage: CreateMessageDTO = {
        content: assistantResponse,
        sender: "bot",
      };

      await pushMessageToChat(token, conversationId, formattedMessage);

      const finalChats = await listAllChatsOfUser(token);
      setConversations(finalChats);
    } catch (error) {
      console.error("Error getting AI response:", error);

      const errorMessage: CreateMessageDTO = {
        content:
          "I encountered an error processing your request. Please try again.",
        sender: "bot",
      };

      try {
        await pushMessageToChat(token, conversationId, errorMessage);

        const errorChats = await listAllChatsOfUser(token);
        setConversations(errorChats);
      } catch (saveError) {
        console.error("Error saving error message:", saveError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionPick = (suggestion: string) => {
    setMessageInput(suggestion);
  };

  const handleOnboardingComplete = async (data: OnboardingData) => {
    setOnboardingLoading(true);
    try {
      if (token) {
        await createUserContext(token, data);
        setUserContext(data);
        setShowOnboarding(false);
        initializeGeminiContext(data);
      }
    } catch (error) {
      console.error("Error saving onboarding data:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setOnboardingLoading(false);
    }
  };

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
  };

  return (
    <UserRequired>
      <OnboardingModal
        isOpen={showOnboarding}
        onComplete={handleOnboardingComplete}
        isLoading={onboardingLoading}
      />

      <div className="relative flex h-screen bg-linear-to-br from-white via-[#FFF5EB] to-white text-gray-900">
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/60 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <ChatSidebar
          conversations={conversations}
          currentConversationId={currentConversationId}
          onSelectConversation={handleSelectConversation}
          onCreateConversation={handleCreateConversation}
          onDeleteConversation={handleDeleteConversation}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex flex-1 flex-col">
          <ChatHeader
            title="IslaBot AI"
            subtitle={
              userContext
                ? `${
                    userContext.location
                  } • ₱${userContext.monthlyIncome.toLocaleString()}`
                : "Community Energy Navigation"
            }
            onToggleSidebar={() => setSidebarOpen((previous) => !previous)}
            actions={
              <div className="flex items-center gap-2 md:gap-4">
                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    aria-label="Profile"
                    className="group relative inline-flex items-center justify-center rounded-full p-2 text-[#FC7019] transition-colors hover:bg-[#FC7019]/10 hover:text-[#E25F17] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FC7019]/40"
                  >
                    <FaRegUserCircle className="h-5 w-5" />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {profileOpen && (
                    <>
                      {/* Backdrop */}
                      <div
                        className="fixed inset-0 z-30"
                        onClick={() => setProfileOpen(false)}
                      />

                      {/* Dropdown */}
                      <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-white/60 bg-white/95 shadow-xl ring-1 ring-black/5 overflow-hidden z-200">
                        {/* Profile Info */}
                        <div className="border-b border-gray-200 p-4">
                          {displayName && (
                            <p className="text-sm font-semibold text-[#131B28]">
                              {displayName}
                            </p>
                          )}
                          {email && (
                            <p className="mt-1 text-xs text-gray-500 break-all">
                              {email}
                            </p>
                          )}
                        </div>

                        {/* Menu Items */}
                        <div className="flex flex-col">
                          <Link
                            href="/dashboard/profile"
                            onClick={() => setProfileOpen(false)}
                            className="px-4 py-3 text-sm font-medium text-gray-700 hover:bg-[#FC7019]/10 hover:text-[#FC7019] transition-colors"
                          >
                            View Profile
                          </Link>

                          <button
                            onClick={handleLogout}
                            className="px-4 py-3 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center gap-2"
                          >
                            <LogOut className="h-4 w-4" />
                            Logout
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            }
          />

          <ChatMessageList
            messages={
              conversations.find(
                (conversation) => conversation.chatId === currentConversationId
              )?.messages || []
            }
            isLoading={isLoading}
            suggestions={SUGGESTED_PROMPTS}
            onSuggestionPick={handleSuggestionPick}
            webSearchEnabled={webSearchEnabled}
          />

          <ChatInput
            value={messageInput}
            onChange={setMessageInput}
            onSend={handleSendMessage}
            isLoading={isLoading}
            webSearchEnabled={webSearchEnabled}
            onToggleWebSearch={() =>
              setWebSearchEnabled((previous) => !previous)
            }
          />
        </div>
      </div>
    </UserRequired>
  );
};

export default AiPage;
