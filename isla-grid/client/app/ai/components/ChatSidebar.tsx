"use client";

import { type ConversationPreview } from "./types";
import { Plus, Trash2, X } from "lucide-react";

interface ChatSidebarProps {
  conversations: ConversationPreview[];
  currentConversationId: string;
  onSelectConversation: (conversationId: string) => void;
  onCreateConversation: () => void;
  onDeleteConversation: (conversationId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const ChatSidebar = ({
  conversations,
  currentConversationId,
  onSelectConversation,
  onCreateConversation,
  onDeleteConversation,
  isOpen,
  onClose,
}: ChatSidebarProps) => {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 w-72 bg-[#FFFAF5] border-r border-[#F2D8C3] shadow-lg transition-transform duration-300 lg:relative lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-[#F2D8C3] bg-white/80 px-5 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#FC7019]">
              IslaGrid
            </p>
            <h2 className="text-lg font-semibold text-gray-900">IslaBot AI</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 transition hover:text-gray-700 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-5 py-4">
          <button
            type="button"
            onClick={onCreateConversation}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#FC7019] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#E8620F]"
          >
            <Plus className="h-4 w-4" />
            New Conversation
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-6">
          <ul className="space-y-2">
            {conversations.map((conversation) => {
              const isActive = conversation.id === currentConversationId;

              return (
                <li key={conversation.id}>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => onSelectConversation(conversation.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onSelectConversation(conversation.id);
                      }
                    }}
                    className={`group flex w-full cursor-pointer items-start justify-between rounded-xl px-4 py-3 text-left transition ${
                      isActive
                        ? "bg-[#FC7019] text-white shadow-md"
                        : "bg-white text-gray-800 shadow-sm hover:bg-[#FFF1E6]"
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">
                          {conversation.title}
                        </span>
                        {conversation.pinned && (
                          <span
                            className={`rounded-full px-2 text-[10px] font-semibold uppercase tracking-wide ${
                              isActive
                                ? "bg-white/30 text-white"
                                : "bg-[#FFE2C9] text-[#FC7019]"
                            }`}
                          >
                            Pinned
                          </span>
                        )}
                      </div>
                      <p
                        className={`mt-1 line-clamp-2 text-xs ${
                          isActive ? "text-white/80" : "text-gray-500"
                        }`}
                      >
                        {conversation.lastMessage}
                      </p>
                      <p
                        className={`mt-2 text-[11px] uppercase tracking-wider ${
                          isActive ? "text-white/70" : "text-gray-400"
                        }`}
                      >
                        {conversation.updatedAt}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onDeleteConversation(conversation.id);
                      }}
                      className={`rounded-full p-1 transition ${
                        isActive
                          ? "text-white/80 hover:bg-white/20 hover:text-white"
                          : "text-gray-400 hover:bg-[#FFE2C9] hover:text-[#FC7019]"
                      }`}
                      aria-label="Delete conversation"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default ChatSidebar;
