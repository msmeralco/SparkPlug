"use client";

import { type ReactNode } from "react";
import { Menu } from "lucide-react";

interface ChatHeaderProps {
  title: string;
  subtitle?: string;
  onToggleSidebar?: () => void;
  actions?: ReactNode;
}

const ChatHeader = ({
  title,
  subtitle,
  onToggleSidebar,
  actions,
}: ChatHeaderProps) => {
  return (
    <header className="flex items-center justify-between border-b border-[#F2D8C3] bg-white/90 px-4 py-4 backdrop-blur-md lg:px-10">
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="rounded-lg border border-[#F2D8C3] bg-white p-2 text-gray-600 transition hover:bg-[#FFF1E6] lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <div>
          <h1 className="text-xl font-semibold text-gray-900 md:text-2xl">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#FC7019]">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
};

export default ChatHeader;
