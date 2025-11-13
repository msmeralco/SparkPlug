"use client";

import { use, useEffect, useMemo, useState } from "react";
import { RotateCcw, Sparkles, LogOut } from "lucide-react";
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
  }, [user?.uid]);

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

  // Initialize Gemini context with user data
  const initializeGeminiContext = (context: OnboardingData) => {
    const systemPrompt = `You are IslaBot, a specialized renewable energy consultant for the IslaGrid platform. You have the following user profile:

**User Context:**
- **Location:** ${context.location}
- **Monthly Income:** ₱${context.monthlyIncome.toLocaleString()}
- **Appliances/Devices:** ${
      context.appliances.length
    } units (${context.appliances.join(", ")})
- **Onboarded Date:** ${new Date().toLocaleDateString()}

**Your Role:**
You provide personalized, data-driven renewable energy solutions specifically tailored to this user's home energy needs. You:
1. Understand their energy consumption patterns based on their appliances
2. Recommend optimal renewable energy systems (Solar, Wind, Hydro, Biomass)
3. Calculate accurate financial projections (ROI, payback periods, savings)
4. Provide implementation timelines and next steps
5. Answer questions about renewable energy technologies
6. Suggest financing options based on their income

**Important Guidelines:**
- Always reference their specific context (location, income, appliances)
- Use Philippine peso (₱) for all financial calculations
- Assume electricity rate of ₱12.5/kWh unless stated otherwise
- Be conversational but professional
- Provide specific, actionable recommendations
- Include calculations and assumptions in your responses
- Consider local climate and resource availability for ${context.location}

When generating proposals, structure responses in clear sections with markdown formatting.`;

    setConversationHistory([
      {
        role: "user",
        parts: [{ text: systemPrompt }],
      },
      {
        role: "model",
        parts: [
          {
            text:
              "I understand my role. I'm ready to be your personalized renewable energy consultant based on your profile. I will provide tailored recommendations for your home in " +
              context.location +
              " based on your appliances and financial situation. What would you like to know about renewable energy solutions for your home?",
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

    const newConversation = await initializeChat(token);
    const defaultMessage: CreateMessageDTO = {
      content:
        "Hello! I am IslaBot, your personalized renewable energy consultant. I'm here to help you design the perfect home energy solution based on your location, income, and appliances. What would you like to know?",
      sender: "bot",
    };
    const updatedConversation = await pushMessageToChat(
      token,
      newConversation.chatId,
      defaultMessage
    );

    const newConversations = await listAllChatsOfUser(token);

    setConversations(newConversations);
    setCurrentConversationId(newConversation.chatId);
    setMessageInput("");
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleDeleteConversation = async (conversationId: string) => {
    if (!token) {
      alert("Please log in to delete a conversation.");
      return;
    }

    const deletedConversation = await deleteChat(token, conversationId);

    const newConversations = await listAllChatsOfUser(token);
    setCurrentConversationId(newConversations[0].chatId);
    setMessageInput("");

    setConversations(newConversations);
  };

  // Call Gemini API with context
  // ...existing code...

  // Call Gemini API with context
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

  // ...existing code...

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

    const updatedChat = await pushMessageToChat(
      token,
      conversationId,
      newMessageDTO
    );

    const updatedChats = await listAllChatsOfUser(token);
    setConversations(updatedChats);

    setMessageInput("");
    setIsLoading(true);

    try {
      // Call Gemini API with user message
      const assistantResponse = await callGeminiAPI(newMessageDTO.content);

      const formattedMessage: CreateMessageDTO = {
        content: assistantResponse,
        sender: "bot",
      };

      const updatedChat = await pushMessageToChat(
        token,
        conversationId,
        formattedMessage
      );

      const updatedChats = await listAllChatsOfUser(token);
      setConversations(updatedChats);
    } catch (error) {
      console.error("Error getting AI response:", error);

      const errorMessage: CreateMessageDTO = {
        content:
          "I encountered an error processing your request. Please try again.",
        sender: "bot",
      };

      const updatedChat = await pushMessageToChat(
        token,
        conversationId,
        errorMessage
      );

      const updatedChats = await listAllChatsOfUser(token);
      setConversations(updatedChats);
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
        const response = await createUserContext(token, data);
        setUserContext(data);
        setShowOnboarding(false);
        initializeGeminiContext(data);
      }
      setUserContext(data);
      setShowOnboarding(false);
      initializeGeminiContext(data);
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
