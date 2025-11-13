"use client";

import { useCallback, type SyntheticEvent } from "react";

const SolutionSection = () => {
  const handleImageError = useCallback(
    (event: SyntheticEvent<HTMLImageElement>) => {
      event.currentTarget.src =
        "https://placehold.co/600x400/34d399/ffffff?text=Community+Energy";
    },
    []
  );

  return (
    <section id="solution" className="py-24 bg-[#131B28] text-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <h2 className="text-sm font-bold uppercase text-[#FC7019] tracking-widest">
              Our Solution
            </h2>
            <p className="mt-3 text-4xl md:text-5xl font-extrabold">
              IslaGrid: The Community Energy Ecosystem
            </p>
            <p className="mt-6 text-lg text-gray-300 leading-relaxed">
              SparkPlug proposes{" "}
              <strong className="font-semibold text-white">IslaGrid</strong>, a
              community-wide expansion of the net-metering program. We empower
              barangays, LGUs, and cooperatives to become micro-powerplant
              franchisees, harnessing their local geography to produce, sell,
              and profit from renewable energy.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-6">
              <a
                href="#features"
                className="bg-[#FC7019] text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-xl hover:brightness-95 transition-all text-center"
              >
                See How It Works
              </a>
              <a
                href="#contact"
                className="border-2 border-[#FC7019] text-[#FC7019] px-8 py-3 rounded-lg text-lg font-semibold hover:bg-[#FC7019]/10 transition-colors text-center"
              >
                Partner With Us
              </a>
            </div>
          </div>
          <div className="lg:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1599712211919-86c0d8c6b1fc?auto=format&fit=crop&w=1000&q=80"
              onError={handleImageError}
              alt="A community solar panel installation"
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
