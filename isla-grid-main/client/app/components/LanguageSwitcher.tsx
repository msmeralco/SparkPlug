"use client";

import { useState, useEffect, useRef } from "react";
import { Languages } from "lucide-react";
import { useLanguage } from "@/providers/language";

const LanguageSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-50" ref={popupRef}>
      {/* Popup */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-48 mb-2">
          <p className="text-sm font-semibold text-gray-700 mb-3">Choose Language</p>
          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-gray-50 transition">
              <input
                type="radio"
                name="language"
                value="en"
                checked={language === "en"}
                onChange={() => {
                  setLanguage("en");
                  setIsOpen(false);
                }}
                className="w-4 h-4 text-[#FC7019] focus:ring-[#FC7019]"
              />
              <span className="text-sm text-gray-700">English</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-gray-50 transition">
              <input
                type="radio"
                name="language"
                value="tl"
                checked={language === "tl"}
                onChange={() => {
                  setLanguage("tl");
                  setIsOpen(false);
                }}
                className="w-4 h-4 text-[#FC7019] focus:ring-[#FC7019]"
              />
              <span className="text-sm text-gray-700">Tagalog</span>
            </label>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#FC7019] hover:bg-orange-600 text-white rounded-full p-4 shadow-lg transition-all transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-orange-300"
        aria-label="Change language"
      >
        <Languages className="w-6 h-6" />
      </button>
    </div>
  );
};

export default LanguageSwitcher;
