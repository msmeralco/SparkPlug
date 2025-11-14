"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Bot, Copy, Globe, Loader2, User } from "lucide-react";
import { type ChatMessage } from "./types";
import TopRenewablesPieChart from "./TopRenewablesPieChart";
import { provinces } from "@/lib/philippineProvinces";
import { Message } from "@/types/chatTypes";
import { getRenewableMixByProvince } from "@/lib/apiEndpoints/renewableDataEndpoints";

interface ChatMessageListProps {
  messages: Message[];
  isLoading: boolean;
  suggestions: string[];
  onSuggestionPick: (suggestion: string) => void;
  webSearchEnabled: boolean;
}

const ChatMessageList = ({
  messages,
  isLoading,
  suggestions,
  onSuggestionPick,
  webSearchEnabled,
}: ChatMessageListProps) => {
  const endRef = useRef<HTMLDivElement>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [mixByProvince, setMixByProvince] = useState<
    Record<
      string,
      { biomass: number; solar: number; hydropower: number; wind: number }
    >
  >({});

  // Load province-level mix from the server once a province is selected
  useEffect(() => {
    if (!selectedLocation) return;

    const controller = new AbortController();

    const fetchMix = async () => {
      try {
        const data = await getRenewableMixByProvince(selectedLocation);

        setMixByProvince((prev) => ({
          ...prev,
          [data.province]: {
            biomass: data.biomass,
            solar: data.solar,
            hydropower: data.hydropower,
            wind: data.wind,
          },
        }));
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        console.error("Error fetching renewable mix", error);
      }
    };

    void fetchMix();

    return () => {
      controller.abort();
    };
  }, [selectedLocation]);

  const chartData = useMemo(() => {
    if (!selectedLocation) return undefined;

    const mix = mixByProvince[selectedLocation];
    if (!mix) return undefined;

    return [
      { name: "Biomass", value: mix.biomass },
      { name: "Solar", value: mix.solar },
      { name: "Hydropower", value: mix.hydropower },
      { name: "Wind", value: mix.wind },
    ];
  }, [mixByProvince, selectedLocation]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto px-3 py-6 md:px-10">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        {/* Location selector + proposal context chart (top renewables) */}
        <div className="rounded-3xl border border-[#F2D8C3] bg-white/90 p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#FC7019]">
                Renewable Insights
              </p>
              <p className="text-sm text-gray-700">
                Pick a location to visualize its top renewable energy mix that
                IslaBot can use in your proposal.
              </p>
            </div>

            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <label
                className="text-xs font-medium text-gray-600"
                htmlFor="location-select"
              >
                View mix for
              </label>
              <select
                id="location-select"
                value={selectedLocation}
                onChange={(event) => setSelectedLocation(event.target.value)}
                className="w-full md:w-56 rounded-2xl border border-[#F2D8C3] bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-[#FC7019] focus:outline-none focus:ring-1 focus:ring-[#FC7019]/40"
              >
                <option value="">Select a province or region</option>
                {provinces.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Only show chart when a location is selected */}
          {selectedLocation && chartData && (
            <div className="mt-4">
              {/* key forces full remount when province changes so Recharts refreshes */}
              <TopRenewablesPieChart key={selectedLocation} data={chartData} />
            </div>
          )}
        </div>

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
              const isAssistant = message.sender === "bot";

              return (
                <div
                  key={message.messageId}
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
                      {message.content.split("\n").map((line, index) => {
                        // Simple markdown-like handling for headings, bold text, and markdown links
                        const isHeading = line.startsWith("## ");
                        const text = isHeading
                          ? line.replace(/^##\s+/, "")
                          : line;

                        // First split the line into markdown link vs non-link parts
                        const linkParts = text.split(/(\[[^\]]+\]\([^\)]+\))/g);

                        const headingClasses = isHeading
                          ? "mb-3 text-base md:text-lg font-semibold tracking-tight"
                          : "mb-2 last:mb-0";

                        return (
                          <p key={index} className={headingClasses}>
                            {linkParts.map((part, partIndex) => {
                              const linkMatch = part.match(
                                /^\[([^\]]+)\]\(([^\)]+)\)$/
                              );

                              if (linkMatch) {
                                const [, label, href] = linkMatch;
                                return (
                                  <a
                                    key={partIndex}
                                    href={href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[#1F3A5F] underline underline-offset-2 hover:text-[#FC7019]"
                                  >
                                    {label}
                                  </a>
                                );
                              }

                              // For non-link text, still support **bold** segments
                              const segments = part.split(/(\*\*[^*]+\*\*)/g);

                              return segments.map((segment, i) => {
                                const boldMatch =
                                  segment.match(/^\*\*(.*)\*\*$/);
                                if (boldMatch) {
                                  return (
                                    <span
                                      key={`${partIndex}-${i}`}
                                      className="font-semibold"
                                    >
                                      {boldMatch[1]}
                                    </span>
                                  );
                                }

                                return (
                                  <span key={`${partIndex}-${i}`}>
                                    {segment}
                                  </span>
                                );
                              });
                            })}
                          </p>
                        );
                      })}
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
                        onClick={() => {
                          navigator.clipboard.writeText(message.content);
                        }}
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
                {/* {webSearchEnabled
                  ? "Searching the web for the latest results..."
                  : "Thinking through the best answer for you..."} */}
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
