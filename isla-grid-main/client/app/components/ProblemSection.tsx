"use client";

import { useLanguage } from "@/providers/language";

const copy = {
  en: {
    title: "The Problem",
    heading: "A Nation of Rich Resources, Sidelined.",
    description: "Despite the Philippines' rich renewable energy potential, most households still rely on expensive, non-renewable power. Many Filipinos struggle with high electricity bills, frequent outages, and limited access to clean energy solutions that truly fit their needs and budgets.",
    card1Title: "High Energy Costs",
    card1Text: "Everyday appliance use and rising electricity rates make monthly bills harder to manage for Filipino families. IslaGrid helps you find cleaner, cheaper power options designed for your home",
    card2Title: "Limited Access to Clean Energy",
    card2Text: "Current net-metering programs mostly benefit private property owners. Renters and small homeowners are often left out of renewable energy opportunities",
    card3Title: "Missed Home Potential",
    card3Text: "Your home's sunlight, space, or local environment could be producing power and savings. IslaGrid helps you unlock your property's renewable potential and turn it into real value.",
  },
  tl: {
    title: "Ang Problema",
    heading: "Isang Bansa ng Mayamang Resources, Naisantabi.",
    description: "Sa kabila ng mayamang renewable energy potential ng Pilipinas, karamihan ng mga tahanan ay umaasa pa rin sa mahal at hindi renewable na kuryente. Maraming Pilipino ang nahihirapan sa mataas na electricity bills, madalas na brownouts, at limitadong access sa clean energy solutions na tunay na swak sa kanilang pangangailangan at budget.",
    card1Title: "Mataas na Gastos sa Kuryente",
    card1Text: "Ang araw-araw na paggamit ng mga appliances at tumataas na electricity rates ay nagiging mas mahirap para sa mga pamilyang Pilipino. Tinutulungan ka ng IslaGrid na makahanap ng mas malinis at mas murang power options na dinisenyo para sa iyong tahanan",
    card2Title: "Limitadong Access sa Clean Energy",
    card2Text: "Ang kasalukuyang net-metering programs ay karamihan ay para lang sa mga may-ari ng private property. Ang mga umuupa at maliliit na homeowners ay madalas na hindi kasama sa mga renewable energy opportunities",
    card3Title: "Nasasayang na Potensyal ng Tahanan",
    card3Text: "Ang sikat ng araw, espasyo, o local environment ng iyong bahay ay maaaring gumawa ng kuryente at savings. Tinutulungan ka ng IslaGrid na i-unlock ang renewable potential ng iyong property at gawing tunay na halaga.",
  },
} as const;

const ProblemSection = () => {
  const { language } = useLanguage();
  const t = copy[language];

  return (
    <section id="problem" className="py-24 bg-[#FFFDFA]">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-sm font-bold uppercase text-[#FC7019] tracking-widest">
            {t.title}
          </h2>
          <p className="mt-3 text-4xl md:text-5xl font-extrabold text-[#131B28]">
            {t.heading}
          </p>
          <p className="mt-6 text-lg text-gray-700 leading-relaxed">
            {t.description}
          </p>
        </div>
      <div className="mt-16 grid md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl">
          <div className="bg-red-100 text-red-600 w-12 h-12 rounded-full flex items-center justify-center">
            {/* icon: bill / high cost */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <rect x="2.5" y="5" width="19" height="14" rx="2" strokeWidth="2" />
              <path d="M7 9h6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M7 15h6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M18 8v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 className="mt-5 text-xl font-bold text-gray-900">
            {t.card1Title}
          </h3>
          <p className="mt-2 text-gray-600">
            {t.card1Text}
          </p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl">
          <div className="bg-yellow-100 text-yellow-600 w-12 h-12 rounded-full flex items-center justify-center">
            {/* icon: sun / clean energy */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="12" r="4" strokeWidth="2" />
              <path d="M12 2v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 20v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4.93 4.93l1.41 1.41" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17.66 17.66l1.41 1.41" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12h2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20 12h2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4.93 19.07l1.41-1.41" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17.66 6.34l1.41-1.41" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="mt-5 text-xl font-bold text-gray-900">
            {t.card2Title}
          </h3>
          <p className="mt-2 text-gray-600">
            {t.card2Text}
          </p>
        </div>
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl">
          <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center">
            {/* icon: house / missed home potential */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M3 11.5L12 4l9 7.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 11.5v6.5a1 1 0 001 1h8a1 1 0 001-1v-6.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 21V14h6v7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="mt-5 text-xl font-bold text-gray-900">
            {t.card3Title}
          </h3>
          <p className="mt-2 text-gray-600">
            {t.card3Text}
          </p>
        </div>
      </div>
    </div>
  </section>
);}
export default ProblemSection;