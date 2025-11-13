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
          Despite abundant renewable energy sources, the Philippines remains
          dependent on costly, non-renewable energy. Current net-metering laws
          benefit private property owners, excluding entire communities from
          harnessing the shared natural resources right in their backyard.
        </p>
      </div>
      <div className="mt-16 grid md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <div className="bg-red-100 text-red-600 w-12 h-12 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2zM12 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 21a1 1 0 01-1-1V4a1 1 0 011-1h10a1 1 0 011 1v16a1 1 0 01-1 1H7zM10 5H7v2h3V5z"
              />
            </svg>
          </div>
          <h3 className="mt-5 text-xl font-bold text-gray-900">
            High Energy Costs
          </h3>
          <p className="mt-2 text-gray-600">
            Rising demand for appliances drives electricity costs higher for
            Filipino families.
          </p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <div className="bg-yellow-100 text-yellow-600 w-12 h-12 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 18a6 6 0 01-6-6"
              />
            </svg>
          </div>
          <h3 className="mt-5 text-xl font-bold text-gray-900">
            Community Exclusion
          </h3>
          <p className="mt-2 text-gray-600">
            Net-metering is limited to private property, barring communities
            from using shared resources.
          </p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 11H5m14 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="mt-5 text-xl font-bold text-gray-900">
            Economic Opportunity Lost
          </h3>
          <p className="mt-2 text-gray-600">
            Local geography (rivers, sunlight) remains untapped as a source of
            community wealth.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default ProblemSection;
