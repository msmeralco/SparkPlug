"use client";

import { useEffect, useMemo, useState } from "react";
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

const DEFAULT_ASSISTANT_MESSAGE: ChatMessage = {
  id: "assistant-welcome",
  role: "assistant",
  content:
    "Hello! I am IslaBot, your guide to the IslaGrid Meralco Community Energy Ecosystem. Ask me how your barangay can generate, distribute, and benefit from community-owned renewable power.",
};

const SUGGESTED_PROMPTS = [
  "Summarize how IslaGrid expands the net-metering program for communities.",
  "What data do we need to generate a proposal for a river-based micro hydro plant?",
  "Explain how revenue distribution works with NFC profit cards.",
  "Outline the AI-Driven Energy Design Studio workflow from input to output.",
];

type ConversationState = Record<string, ChatMessage[]>;

const AiPage = () => {
  const { user, state, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingLoading, setOnboardingLoading] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [currentConversationId, setCurrentConversationId] = useState("welcome");
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [userContext, setUserContext] = useState<OnboardingData | null>(null);
  const [conversations, setConversations] = useState<ConversationPreview[]>([
    {
      id: "welcome",
      title: "Fresh Chat",
      lastMessage: "Ask IslaBot how IslaGrid powers communities.",
      updatedAt: "Just now",
      pinned: true,
    },
  ]);
  const [messagesByConversation, setMessagesByConversation] =
    useState<ConversationState>({
      welcome: [DEFAULT_ASSISTANT_MESSAGE],
    });

  const currentMessages = useMemo(() => {
    return messagesByConversation[currentConversationId] ?? [];
  }, [messagesByConversation, currentConversationId]);

  const displayName =
    user?.displayName || user?.email?.split("@")[0] || "Your Account";
  const email = user?.email;

  // Check if user is already onboarded
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const response = await fetch("/api/user/context");
        if (response.ok) {
          const data = await response.json();
          if (data.contextValue) {
            setUserContext(data.contextValue);
            setShowOnboarding(false);
          }
        } else if (response.status === 404) {
          // User context doesn't exist, show onboarding
          setShowOnboarding(true);
        }
      } catch (error) {
        console.error("Failed to check onboarding status:", error);
        // Default to showing onboarding on error
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

  const updateConversationPreview = (
    conversationId: string,
    lastMessage: string
  ) => {
    setConversations((previous) => {
      const existing = previous.find(
        (conversation) => conversation.id === conversationId
      );
      const updatedConversation: ConversationPreview = existing
        ? {
            ...existing,
            lastMessage,
            updatedAt: "Just now",
          }
        : {
            id: conversationId,
            title: "New Conversation",
            lastMessage,
            updatedAt: "Just now",
          };

      const withoutCurrent = previous.filter(
        (conversation) => conversation.id !== conversationId
      );
      return [updatedConversation, ...withoutCurrent];
    });
  };

  const handleSelectConversation = (conversationId: string) => {
    setCurrentConversationId(conversationId);
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleCreateConversation = () => {
    const newId = `conversation-${Date.now()}`;
    const newPreview: ConversationPreview = {
      id: newId,
      title: "Untitled Chat",
      lastMessage: "Start planning your community energy project.",
      updatedAt: "Just now",
    };

    setConversations((previous) => [newPreview, ...previous]);
    setMessagesByConversation((previous) => ({
      ...previous,
      [newId]: [DEFAULT_ASSISTANT_MESSAGE],
    }));
    setCurrentConversationId(newId);
    setMessageInput("");
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleDeleteConversation = (conversationId: string) => {
    const remainingPreviews = conversations.filter(
      (conversation) => conversation.id !== conversationId
    );

    const fallbackConversations =
      remainingPreviews.length > 0
        ? remainingPreviews
        : [
            {
              id: "welcome",
              title: "Fresh Chat",
              lastMessage: "Ask IslaBot how IslaGrid powers communities.",
              updatedAt: "Just now",
              pinned: true,
            },
          ];

    setConversations(fallbackConversations);

    setMessagesByConversation((previous) => {
      const { [conversationId]: _removed, ...rest } = previous;
      let newMessagesByConversation;
      if (Object.keys(rest).length > 0) {
        newMessagesByConversation = rest;
      } else {
        newMessagesByConversation = {
          welcome: [DEFAULT_ASSISTANT_MESSAGE],
        };
      }

      if (conversationId === currentConversationId) {
        const fallbackId =
          fallbackConversations.find((conv) =>
            newMessagesByConversation.hasOwnProperty(conv.id)
          )?.id ??
          Object.keys(newMessagesByConversation)[0] ??
          "welcome";
        setCurrentConversationId(fallbackId);
        setIsLoading(false);
      }

      return newMessagesByConversation;
    });
  };

  const simulateAssistantReply = (
    prompt: string,
    useSearch: boolean
  ): ChatMessage => {
    const trimmed = prompt.trim();
    const topic = trimmed.length > 0 ? trimmed : "your request";
    const snippet = topic.length > 80 ? `${topic.slice(0, 77)}...` : topic;

    const baseResponse = userContext
      ? `Based on your energy profile in ${
          userContext.location
        } with monthly income of ₱${userContext.monthlyIncome.toLocaleString()} and ${
          userContext.appliances.length
        } appliances, here's my analysis regarding "${snippet}":\n\n`
      : `Here's my recommendation regarding "${snippet}":\n\n`;

    const details = `1. Generation — assess solar, hydro, wind, or hybrid potential using the AI-Driven Energy Design Studio.\n2. Distribution — connect community-owned assets to Meralco's grid with smart metering for transparent exports.\n3. Benefit Sharing — route revenues into NFC profit cards so residents experience direct economic uplift.\n\nProvide location, resource data, demand profile, and community stakeholders if you want me to draft a tailored IslaGrid rollout.`;

    return {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      usedSearch: useSearch,
      content: baseResponse + details,
    };
  };

  const handleSendMessage = () => {
    if (messageInput.trim().length === 0 || isLoading) {
      return;
    }

    const conversationId = currentConversationId;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: messageInput.trim(),
    };

    setMessagesByConversation((previous) => {
      const current = previous[conversationId] ?? [];
      return {
        ...previous,
        [conversationId]: [...current, userMessage],
      };
    });

    updateConversationPreview(conversationId, messageInput.trim());
    setMessageInput("");
    setIsLoading(true);

    const shouldUseSearch = webSearchEnabled;

    window.setTimeout(
      () => {
        const assistantMessage = simulateAssistantReply(
          userMessage.content,
          shouldUseSearch
        );
        setMessagesByConversation((previous) => {
          const current = previous[conversationId] ?? [];
          return {
            ...previous,
            [conversationId]: [...current, assistantMessage],
          };
        });
        updateConversationPreview(conversationId, assistantMessage.content);
        setIsLoading(false);
      },
      shouldUseSearch ? 1200 : 800
    );
  };

  const handleSuggestionPick = (suggestion: string) => {
    setMessageInput(suggestion);
  };

  const handleResetConversation = () => {
    setMessagesByConversation((previous) => ({
      ...previous,
      [currentConversationId]: [DEFAULT_ASSISTANT_MESSAGE],
    }));
    updateConversationPreview(
      currentConversationId,
      "Ask IslaBot how IslaGrid powers communities."
    );
    setMessageInput("");
    setIsLoading(false);
  };

  const handleOnboardingComplete = async (data: OnboardingData) => {
    setOnboardingLoading(true);
    try {
      const response = await fetch("/api/user/context", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location: data.location,
          monthlyIncome: data.monthlyIncome,
          monthlyExpenses: data.monthlyExpenses,
          appliances: data.appliances,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setUserContext(data);
        setShowOnboarding(false);
      } else {
        const error = await response.json();
        console.error("Failed to save onboarding data:", error);
        alert("Failed to save your profile. Please try again.");
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
                {/* Reset Button */}
                {/* <button
                  type="button"
                  onClick={handleResetConversation}
                  className="hidden sm:flex items-center gap-2 rounded-full border border-[#F2D8C3] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-600 transition hover:border-[#FC7019] hover:text-[#FC7019]"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Reset
                </button> */}

                {/* IslaGrid Trusted Badge */}
                {/* <div className="hidden md:flex items-center gap-2 rounded-full border border-[#FC7019]/30 bg-[#FFF5EB] px-4 py-1 text-xs font-semibold uppercase tracking-wider text-[#FC7019]">
                  <Sparkles className="h-3.5 w-3.5" /> IslaGrid Trusted
                </div> */}

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
                      <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-white/60 bg-white/95 shadow-xl ring-1 ring-black/5 z-40 overflow-hidden">
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
            messages={currentMessages}
            isLoading={isLoading}
            suggestions={SUGGESTED_PROMPTS}
            onSuggestionPick={handleSuggestionPick}
            onCopyMessage={(messageId) => {
              const message = currentMessages.find(
                (item) => item.id === messageId
              );
              if (message) {
                window.navigator.clipboard
                  .writeText(message.content)
                  .catch(() => {});
              }
            }}
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
