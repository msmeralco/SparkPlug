"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/providers/language";

const copy = {
  en: {
    title: "Our Solution",
    heading: "IslaGrid: The Community Energy Ecosystem",
    description1: "SparkPlug proposes",
    islaGrid: "IslaGrid",
    description2: ", a community-wide expansion of the net-metering program. We empower barangays, LGUs, and cooperatives to become micro-powerplant franchisees, harnessing their local geography to produce, sell, and profit from renewable energy.",
    ctaPrimary: "See How It Works",
    ctaSecondary: "Partner With Us",
    imageAlt: "A community solar panel installation",
  },
  tl: {
    title: "Ang Aming Solusyon",
    heading: "IslaGrid: Ang Community Energy Ecosystem",
    description1: "Iminumungkahi ng SparkPlug ang",
    islaGrid: "IslaGrid",
    description2: ", isang community-wide expansion ng net-metering program. Binibigyan namin ng kapangyarihan ang mga barangay, LGU, at kooperatiba upang maging micro-powerplant franchisees, na ginagamit ang kanilang lokal na heograpiya upang gumawa, magbenta, at kumita mula sa renewable energy.",
    ctaPrimary: "Tingnan Kung Paano Ito Gumagana",
    ctaSecondary: "Makipagtulungan Sa Amin",
    imageAlt: "Isang community solar panel installation",
  },
} as const;

const SolutionSection = () => {
  const { language } = useLanguage();
  const t = copy[language];
  const [imageSrc, setImageSrc] = useState<string>("/aaa.png");

  const handleImageError = useCallback(() => {
    setImageSrc(
      "https://placehold.co/600x400/34d399/ffffff?text=Community+Energy"
    );
  }, []);

  return (
    <section id="solution" className="py-24 bg-[#131B28] text-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center lg:items-stretch justify-between gap-12">
          <div className="lg:w-1/2 lg:pr-6 xl:pr-12">
            <h2 className="text-sm font-bold uppercase text-[#FC7019] tracking-widest">
              {t.title}
            </h2>
            <p className="mt-3 text-4xl md:text-5xl font-extrabold">
              {t.heading}
            </p>
            <p className="mt-6 text-lg text-gray-300 leading-relaxed">
              {t.description1}{" "}
              <strong className="font-semibold text-white">{t.islaGrid}</strong>
              {t.description2}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-6">
              <a
                href="#features"
                className="bg-[#FC7019] text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-xl hover:brightness-95 transition-all text-center"
              >
                {t.ctaPrimary}
              </a>
              <a
                href="#contact"
                className="border-2 border-[#FC7019] text-[#FC7019] px-8 py-3 rounded-lg text-lg font-semibold hover:bg-[#FC7019]/10 transition-colors text-center"
              >
                {t.ctaSecondary}
              </a>
            </div>
          </div>
          <div className="lg:w-1/2 lg:pl-6 xl:pl-12 flex justify-center lg:justify-end">
            <Image
              src={imageSrc}
              onError={handleImageError}
              alt={t.imageAlt}
              className="rounded-2xl shadow-2xl max-w-full"
              width={600}
              height={400}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
