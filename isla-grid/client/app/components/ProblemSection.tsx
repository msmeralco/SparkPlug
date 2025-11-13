const ProblemSection = () => (
  <section id="problem" className="py-24 bg-[#FFFDFA]">
    <div className="container mx-auto px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-sm font-bold uppercase text-[#FC7019] tracking-widest">
          The Problem
        </h2>
        <p className="mt-3 text-4xl md:text-5xl font-extrabold text-[#131B28]">
          A Nation of Rich Resources, Sidelined.
        </p>
        <p className="mt-6 text-lg text-gray-700 leading-relaxed">
          Despite the Philippines’ rich renewable energy potential, most households still rely on expensive, non-renewable power. Many Filipinos struggle with high electricity bills, frequent outages, and limited access to clean energy solutions that truly fit their needs and budgets.
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
            High Energy Costs
          </h3>
          <p className="mt-2 text-gray-600">
            Everyday appliance use and rising electricity rates make monthly bills harder to manage for Filipino families. <br /> <br />
            IslaGrid helps you find cleaner, cheaper power options designed for your home
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
            Limited Access to Clean Energy
          </h3>
          <p className="mt-2 text-gray-600">
            Current net-metering programs mostly benefit private property owners. <br /> <br /> Renters and small homeowners are often left out of renewable energy opportunities
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
            Missed Home Potential
          </h3>
          <p className="mt-2 text-gray-600">
            Your home’s sunlight, space, or local environment could be producing power and savings. <br/> <br/>
            IslaGrid helps you unlock your property’s renewable potential and turn it into real value.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default ProblemSection;