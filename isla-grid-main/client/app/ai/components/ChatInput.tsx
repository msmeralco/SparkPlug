"use client";

import { useEffect, useRef } from "react";
import { Globe, Send } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  webSearchEnabled: boolean;
  onToggleWebSearch: () => void;
}

const ChatInput = ({
  value,
  onChange,
  onSend,
  isLoading,
  webSearchEnabled,
  onToggleWebSearch,
}: ChatInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [value]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSend();
    }
  };

  return (
    <div className="border-t border-[#F2D8C3] bg-white/90 px-3 py-4 backdrop-blur-md md:px-10">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-3xl border border-[#F2D8C3] bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your community energy goals, available resources, or rollout timeline..."
            className="flex-1 resize-none rounded-2xl border border-[#F2D8C3] bg-white px-3 py-3 text-sm text-gray-900 shadow-inner focus:border-[#FC7019] focus:outline-none"
            rows={1}
            maxLength={1200}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={onSend}
            disabled={isLoading || value.trim().length === 0}
            className={`flex h-12 w-12 items-center justify-center rounded-full transition ${
              isLoading || value.trim().length === 0
                ? "bg-gray-200 text-gray-400"
                : "bg-[#FC7019] text-white hover:bg-[#E8620F]"
            }`}
            aria-label="Send message"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500">
          {/* <button
            type="button"
            onClick={onToggleWebSearch}
            className={`flex items-center gap-2 rounded-full border px-3 py-1 transition ${
              webSearchEnabled
                ? "border-[#FC7019] bg-[#FFF1E6] text-[#FC7019]"
                : "border-[#F2D8C3] text-gray-600 hover:border-[#FC7019] hover:text-[#FC7019]"
            }`}
          >
            <Globe className="h-3.5 w-3.5" />
            Web search {webSearchEnabled ? "enabled" : "disabled"}
          </button> */}
          <p className="text-right text-[11px] uppercase tracking-[0.2em]">
            Shift + Enter to add a line
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
