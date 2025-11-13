import ProposalForm from "./ProposalForm";

const FeaturesSection = () => (
  <section id="features" className="py-24 bg-white">
    <div className="container mx-auto px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-sm font-bold uppercase text-[#FC7019] tracking-widest">
          How It Works
        </h2>
        <p className="mt-3 text-4xl md:text-5xl font-extrabold text-[#131B28]">
          A 2-Step System for Community Empowerment
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
      <div className="mt-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        <div className="lg:w-1/2 lg:pr-10">
          <span className="inline-flex items-center px-4 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
            Step 2: Profit & Empower
          </span>
          <h3 className="mt-4 text-3xl font-extrabold text-[#131B28]">
            NFC Card & Resident Web App
          </h3>
          <p className="mt-4 text-lg text-gray-700">
           Earnings from your excess solar energy are transferred securely through an NFC-linked account, giving you full control over how to use your energy credits. You can apply them as a discount on your next monthly electricity bill or spend your excess credits with partnered local SMEs as a new mode of sustainable payment.
          </p>
          <p className="mt-4 text-lg text-gray-700">
            All transactions, balances, and energy performance are easily accessible through your personal web dashboard, so you always know how much you’re saving and earning.
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
