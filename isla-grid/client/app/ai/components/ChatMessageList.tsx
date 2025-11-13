"use client";

import { Fragment, useEffect, useRef } from "react";
import { Bot, Copy, Globe, Loader2, User } from "lucide-react";
import { type ChatMessage } from "./types";

interface ChatMessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  suggestions: string[];
  onSuggestionPick: (suggestion: string) => void;
  onCopyMessage?: (messageId: string) => void;
  webSearchEnabled: boolean;
}

const ChatMessageList = ({
  messages,
  isLoading,
  suggestions,
  onSuggestionPick,
  onCopyMessage,
  webSearchEnabled,
}: ChatMessageListProps) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto px-3 py-6 md:px-10">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        {messages.length === 0 && !isLoading ? (
          <div className="rounded-3xl border border-[#F2D8C3] bg-white p-6 text-center text-gray-900 shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FC7019]/15 text-[#FC7019]">
              <Bot className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-2xl font-semibold">Welcome to IslaBot</h2>
            <p className="mt-2 text-sm text-gray-600">
              Plan IslaGrid deployments, analyze renewable resources, and map
              out community-wide energy benefits.
            </p>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => onSuggestionPick(suggestion)}
                  className="rounded-2xl border border-[#F2D8C3] bg-white px-4 py-3 text-left text-sm text-gray-800 transition hover:border-[#FC7019] hover:bg-[#FFF1E6]"
                  type="button"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <Fragment>
            {messages.map((message) => {
              const isAssistant = message.role === "assistant";

              return (
                <div
                  key={message.id}
                  className={`flex ${
                    isAssistant ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`relative max-w-[90%] rounded-3xl px-4 py-3 text-sm md:text-base ${
                      isAssistant
                        ? "bg-[#FFF5EB] text-gray-900 border border-[#F2D8C3]"
                        : "bg-[#FC7019] text-white shadow"
                    }`}
                  >
                    <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
                      {isAssistant ? (
                        <>
                          <Bot className="h-4 w-4" />
                          <span>IslaBot</span>
                          {message.usedSearch && (
                            <span className="flex items-center gap-1 rounded-full bg-white/60 px-2 py-0.5 text-[10px] text-gray-800">
                              <Globe className="h-3 w-3" /> Web Search
                            </span>
                          )}
                        </>
                      ) : (
                        <>
                          <span>You</span>
                          <User className="h-4 w-4" />
                        </>
                      )}
                    </div>

                    <div className="text-sm leading-relaxed md:text-base">
                      {message.content.split("\n").map((line, index) => (
                        <p
                          key={index}
                          className="mb-2 last:mb-0"
                        >
                          {line}
                        </p>
                      ))}
                    </div>

                    {isAssistant &&
                      message.references &&
                      message.references.length > 0 && (
                        <div className="mt-3 rounded-2xl border border-[#F2D8C3] bg-white p-3 text-xs text-gray-700">
                          <p className="mb-2 font-semibold uppercase tracking-wide text-[#FC7019]">
                            References
                          </p>
                          <ul className="space-y-1">
                            {message.references.map((reference) => (
                              <li key={reference.url}>
                                <a
                                  className="text-[#1F3A5F] underline-offset-2 hover:text-[#FC7019] hover:underline"
                                  href={reference.url}
                                  rel="noreferrer"
                                  target="_blank"
                                >
                                  {reference.title ?? reference.url}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    {isAssistant && (
                      <button
                        type="button"
                        onClick={() => onCopyMessage?.(message.id)}
                        className="mt-3 flex items-center gap-2 text-xs uppercase tracking-wide text-[#FC7019] transition hover:text-[#D85505]"
                      >
                        <Copy className="h-3.5 w-3.5" /> Copy
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </Fragment>
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-3 rounded-3xl border border-[#F2D8C3] bg-white px-4 py-3 text-sm text-gray-700 shadow-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>
                {webSearchEnabled
                  ? "Searching the web for the latest results..."
                  : "Thinking through the best answer for you..."}
              </span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
};

export default ChatMessageList;
