"use client";

import { useLanguage } from "@/providers/language";

const copy = {
  en: {
    copyright: "© 2025 SparkPlug. All rights reserved.",
    tagline: "Pioneering community-based renewable energy in the Philippines.",
  },
  tl: {
    copyright: "© 2025 SparkPlug. Lahat ng karapatan ay nakalaan.",
    tagline: "Nangunguna sa community-based renewable energy sa Pilipinas.",
  },
} as const;

const Footer = () => {
  const { language } = useLanguage();
  const t = copy[language];

  return (
    <footer className="bg-[#131B28] text-gray-400">
      <div className="container mx-auto px-6 py-10 text-center">
        <p className="text-2xl font-bold text-white mb-2">
          <span className="text-[#FC7019]">Spark</span>Plug
        </p>
        <p>{t.copyright}</p>
        <p className="text-sm mt-1">{t.tagline}</p>
      </div>
    </footer>
  );
};

export default Footer;
