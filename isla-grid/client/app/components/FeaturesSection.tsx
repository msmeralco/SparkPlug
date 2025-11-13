import ProposalForm from "./ProposalForm";

const FeaturesSection = () => (
  <section id="features" className="py-24 bg-white">
    <div className="container mx-auto px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-sm font-bold uppercase text-[#FC7019] tracking-widest">
          How It Works
        </h2>
        <p className="mt-3 text-4xl md:text-5xl font-extrabold text-[#131B28]">
          A 3-Step System for Community Empowerment
        </p>
      </div>
      <div className="mt-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        <div className="lg:w-1/2 lg:pr-10">
          <span className="inline-flex items-center px-4 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
            Step 1: Design
          </span>
          <h3 className="mt-4 text-3xl font-extrabold text-[#131B28]">
            AI-Driven Energy Design Studio
          </h3>
          <p className="mt-4 text-lg text-gray-700">
            Our web tool generates a comprehensive proposal for your community's
            renewable energy plant. It analyzes location, geography, population,
            and infrastructure to recommend the optimal system (solar, hydro,
            wind, or hybrid) and provides a detailed cost breakdown.
          </p>
        </div>
        <div className="lg:w-1/2 w-full">
          <ProposalForm />
        </div>
      </div>
      <div className="mt-20 flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20">
        <div className="lg:w-1/2 lg:pl-10">
          <span className="inline-flex items-center px-4 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
            Step 2: Produce & Sell
          </span>
          <h3 className="mt-4 text-3xl font-extrabold text-[#131B28]">
            Smart Energy Exchange Platform
          </h3>
          <p className="mt-4 text-lg text-gray-700">
            The community's new plant connects to Meralco's grid via a smart
            meter. As a micro-powerplant franchisee, your LGU sells electricity
            directly to the national grid. Meralco takes a small commission
            until the plant is paid off, ensuring a self-sustaining financial
            model.
          </p>
          <p className="mt-4 text-lg text-gray-700">
            A public website provides transparent monthly readings for full
            accountability.
          </p>
        </div>
        <div className="lg:w-1/2 w-full">
          <div className="bg-[#131B28] rounded-2xl shadow-2xl border p-8 text-white">
            <h4 className="text-xl font-bold">
              Live Monitoring Dashboard (Demo)
            </h4>
            <p className="text-sm text-gray-400 mb-6">
              Barangay San Juan - Hydro Plant
            </p>
            <div className="mt-8">
              <p className="text-sm uppercase tracking-wider text-[#FC7019]">
                Energy Sold to Grid (Last 30 Days)
              </p>
              <p className="text-4xl font-extrabold">
                12,450{" "}
                <span className="text-2xl font-medium text-gray-300">kWh</span>
              </p>
              <div className="w-full h-2 bg-gray-700 rounded-full mt-2">
                <div className="w-3/4 h-2 bg-[#FC7019] rounded-full"></div>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                75% of 16,600 kWh capacity
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        <div className="lg:w-1/2 lg:pr-10">
          <span className="inline-flex items-center px-4 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
            Step 3: Profit & Empower
          </span>
          <h3 className="mt-4 text-3xl font-extrabold text-[#131B28]">
            NFC Card & Resident Web App
          </h3>
          <p className="mt-4 text-lg text-gray-700">
            Profits are distributed directly to residents via a secure NFC card,
            linked to a centralized banking system. This gives families the
            freedom to use their earnings for goods and services, not just as
            bill credits.
          </p>
          <p className="mt-4 text-lg text-gray-700">
            Residents can track their balance, transactions, and community
            energy stats through a simple web application.
          </p>
        </div>
        <div className="lg:w-1/2 w-full flex flex-col sm:flex-row gap-8 items-center justify-center">
          <div className="w-80 h-48 bg-linear-to-br from-gray-700 to-gray-900 rounded-2xl p-6 flex flex-col justify-between shadow-2xl transform -rotate-3">
            <div>
              <span className="text-white font-bold text-xl">IslaGrid</span>
              <span className="text-gray-300 text-sm float-right font-mono">
                NFC
              </span>
            </div>
            <div className="w-10 h-8 bg-yellow-400 rounded-md"></div>
            <div>
              <p className="text-gray-400 text-sm font-mono">
                1234 5678 9012 3456
              </p>
              <p className="text-white text-lg font-medium">JUAN DELA CRUZ</p>
            </div>
          </div>
          <div className="mockup-phone transform rotate-3">
            <div className="mockup-phone-screen space-y-4">
              <h3 className="text-xl font-bold text-[#131B28]">
                My IslaGrid Wallet
              </h3>
              <div className="bg-[#FC7019] text-white p-4 rounded-lg">
                <p className="text-sm uppercase">Current Balance</p>
                <p className="text-3xl font-bold">₱ 1,482.50</p>
              </div>
              <h4 className="font-bold text-gray-800 pt-2">
                Recent Transactions
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>SM Supermarket</span>
                  <span className="font-medium text-red-600">-₱ 500.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Community Profit Share</span>
                  <span className="font-medium text-green-600">+₱ 750.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Local Bakery</span>
                  <span className="font-medium text-red-600">-₱ 120.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default FeaturesSection;
