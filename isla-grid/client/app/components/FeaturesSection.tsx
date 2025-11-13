import {
  ArrowRight,
  BarChart3,
  Building2,
  Coffee,
  Globe2,
  MapPin,
  Sparkles,
  Stethoscope,
  Store,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import ProposalForm from "./ProposalForm";

const FeaturesSection = () => (
  <section id="features" className="py-24 bg-white">
    <div className="container mx-auto px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-sm font-bold uppercase text-[#FC7019] tracking-widest">
          How It Works
        </h2>
        <p className="mt-3 text-4xl md:text-5xl font-extrabold text-[#131B28]">
          A 4-Step Journey to Renewable Energy
        </p>
      </div>
      {/* STEP 1: Onboard & Analyze */}
      <div className="mt-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        <div className="lg:w-1/2 lg:pr-10">
          <span className="inline-flex items-center px-4 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
            Step 1: Onboard & Analyze
          </span>
          <h3 className="mt-4 text-3xl font-extrabold text-[#131B28]">
            Community Profile Assessment
          </h3>
          <p className="mt-4 text-lg text-gray-700">
            Tell us about your barangay or LGU. Input your location, available natural resources, community population, and existing infrastructure. Our AI analyzes this data to understand your unique renewable energy potential and constraints.
          </p>
          <ul className="mt-6 space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <MapPin className="mt-1 h-5 w-5 text-[#FC7019]" />
              <span>Geographic location and climate patterns</span>
            </li>
            <li className="flex items-start gap-3">
              <Zap className="mt-1 h-5 w-5 text-[#FC7019]" />
              <span>Available resources (solar, wind, hydro potential)</span>
            </li>
            <li className="flex items-start gap-3">
              <Users className="mt-1 h-5 w-5 text-[#FC7019]" />
              <span>Community population and energy demand</span>
            </li>
            <li className="flex items-start gap-3">
              <Building2 className="mt-1 h-5 w-5 text-[#FC7019]" />
              <span>Infrastructure readiness and grid connectivity</span>
            </li>
          </ul>
        </div>
        <div className="lg:w-1/2 w-full">
          <ProposalForm />
        </div>
      </div>
      {/* STEP 2: AI-Driven Energy Design Studio */}
      <div className="mt-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        <div className="lg:w-1/2 w-full">
          {/* AI report presented on a laptop mockup */}
          <div className="relative mx-auto w-full max-w-xl">
            <div className="rounded-[28px] border border-slate-800 bg-slate-900 p-4 shadow-2xl shadow-slate-900/40">
              <div className="rounded-2xl bg-slate-950 p-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-400"></span>
                  <span className="h-2 w-2 rounded-full bg-yellow-400"></span>
                  <span className="h-2 w-2 rounded-full bg-green-400"></span>
                </div>
                <div className="mt-4 rounded-xl bg-white p-6 shadow-lg shadow-slate-900/10">
                  <div className="flex items-start justify-between border-b border-gray-200 pb-4">
                    <div>
                      <p className="text-xs font-semibold uppercase text-gray-500">IslaGrid AI Report</p>
                      <h4 className="mt-1 text-xl font-bold text-[#131B28]">Barangay San Juan Energy Plan</h4>
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-[#FC7019]">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>AI Draft</span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-4 text-sm text-gray-700">
                    <p>
                      IslaGrid recommends a hybrid solar and wind configuration tailored to Barangay San Juan&apos;s coastal climate, maximizing production while maintaining grid stability.
                    </p>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <div className="mt-1 h-2 w-2 rounded-full bg-[#FC7019]"></div>
                        <div>
                          <p className="font-semibold text-[#131B28]">Projected Annual Output</p>
                          <p className="text-gray-600">45,320 kWh generated with 18% buffer for demand spikes.</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="mt-1 h-2 w-2 rounded-full bg-[#FC7019]"></div>
                        <div>
                          <p className="font-semibold text-[#131B28]">Estimated Investment</p>
                          <p className="text-gray-600">₱800K total with phased deployment over 4 quarters.</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="mt-1 h-2 w-2 rounded-full bg-[#FC7019]"></div>
                        <div>
                          <p className="font-semibold text-[#131B28]">Payback Period</p>
                          <p className="text-gray-600">Return on investment in 16 months via ₱50,000 monthly savings.</p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
                      <p className="font-semibold text-[#131B28]">Implementation Guidance</p>
                      <p className="mt-1 text-gray-600">
                        Coordinate with local cooperatives for installation permits and leverage IslaGrid&apos;s financing partners for zero upfront cost programs.
                      </p>
                    </div>
                  </div>

                  <a
                    href="#"
                    className="mt-6 inline-flex items-center gap-2 rounded-md bg-[#FC7019] px-4 py-2 font-semibold text-white transition-colors hover:bg-orange-600"
                  >
                    <span>Download Full Proposal</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-600 mb-3">Cost Breakdown</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">Solar Panels (50%)</span>
                    <div className="w-24 bg-gray-200 rounded h-2">
                      <div className="bg-yellow-400 h-2 rounded" style={{width: "50%"}}></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">Wind Turbines (30%)</span>
                    <div className="w-24 bg-gray-200 rounded h-2">
                      <div className="bg-blue-400 h-2 rounded" style={{width: "30%"}}></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">Installation (20%)</span>
                    <div className="w-24 bg-gray-200 rounded h-2">
                      <div className="bg-green-400 h-2 rounded" style={{width: "20%"}}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <button className="w-full bg-[#FC7019] hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors">
                View Full Proposal →
              </button>
            </div>
            <div className="mx-auto mt-4 h-4 w-3/5 rounded-b-3xl bg-slate-700"></div>
            <div className="mx-auto mt-1 h-2 w-2/5 rounded-full bg-slate-500"></div>
          </div>
        </div>

        <div className="lg:w-1/2 lg:pr-10">
          <span className="inline-flex items-center px-4 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
            Step 2: AI-Driven Design
          </span>
          <h3 className="mt-4 text-3xl font-extrabold text-[#131B28]">
            AI-Driven Energy Design Studio
          </h3>
          <p className="mt-4 text-lg text-gray-700">
            Our AI analyzes your community data and generates a comprehensive renewable energy proposal. We evaluate location, geography, population energy demand, and grid connection feasibility to recommend the optimal system.
          </p>
          
          <div className="mt-6 space-y-4">
            <div className="flex gap-3">
              <Globe2 className="mt-1 h-6 w-6 text-[#FC7019]" />
              <div>
                <p className="font-semibold text-[#131B28]">Evaluate Location &amp; Geography</p>
                <p className="text-sm text-gray-600">Analyze climate, terrain, and renewable potential</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">📊</span>
              <div>
                <p className="font-semibold text-[#131B28]">Calculate Energy Demand</p>
                <p className="text-sm text-gray-600">Estimate population energy needs based on infrastructure</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Sparkles className="mt-1 h-6 w-6 text-[#FC7019]" />
              <div>
                <p className="font-semibold text-[#131B28]">Recommend Optimal System</p>
                <p className="text-sm text-gray-600">Solar, wind, hydro, or hybrid—matched to your resources</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Wallet className="mt-1 h-6 w-6 text-[#FC7019]" />
              <div>
                <p className="font-semibold text-[#131B28]">Generate Cost &amp; ROI Analysis</p>
                <p className="text-sm text-gray-600">Detailed breakdown with payback period projections</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STEP 3: Consult & Optimize */}
      <div className="mt-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        <div className="lg:w-1/2 lg:pr-10">
          <span className="inline-flex items-center px-4 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
            Step 3: Consult & Optimize
          </span>
          <h3 className="mt-4 text-3xl font-extrabold text-[#131B28]">
            Personal Energy Consultant Chatbot
          </h3>
          <p className="mt-4 text-lg text-gray-700">
            Chat with our AI energy consultant to get personalized answers based on your community&apos;s unique profile and proposal. Ask questions, get optimization tips, and receive expert guidance on maximizing energy generation and ROI.
          </p>
          
          <div className="mt-6 space-y-3">
            <p className="font-semibold text-[#131B28]">Common Questions Answered:</p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex gap-2">
                <span className="text-[#FC7019]">💬</span>
                <span>&quot;Which renewable source is best for our barangay?&quot;</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#FC7019]">💬</span>
                <span>&quot;How can we maximize energy output?&quot;</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#FC7019]">💬</span>
                <span>&quot;What&apos;s the expected payback period?&quot;</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#FC7019]">💬</span>
                <span>&quot;How do we maintain the system efficiently?&quot;</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#FC7019]">💬</span>
                <span>&quot;What government incentives are available?&quot;</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="lg:w-1/2 w-full">
          {/* Chat Interface Mockup */}
          <div className="bg-linear-to-br from-gray-50 to-white rounded-2xl p-6 shadow-xl border border-gray-200">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {/* Assistant Message */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#FC7019] flex items-center justify-center text-white text-sm font-bold">
                  AI
                </div>
                <div className="flex-1 bg-gray-100 rounded-lg p-3 rounded-tl-none">
                  <p className="text-sm text-gray-800">
                    Hello! I&apos;m your AI Energy Consultant. I&apos;ve analyzed your community profile and generated a solar-wind hybrid proposal. How can I help optimize your energy generation today?
                  </p>
                </div>
              </div>

              {/* User Message */}
              <div className="flex gap-3 justify-end">
                <div className="flex-1 bg-[#FC7019] rounded-lg p-3 rounded-tr-none text-white">
                  <p className="text-sm">
                    Which source generates more during monsoon season?
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-bold">
                  You
                </div>
              </div>

              {/* Assistant Response */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#FC7019] flex items-center justify-center text-white text-sm font-bold">
                  AI
                </div>
                <div className="flex-1 bg-gray-100 rounded-lg p-3 rounded-tl-none">
                  <p className="text-sm text-gray-800">
                    Great question! During monsoon season, wind turbines significantly outperform solar panels. Wind speeds increase 50-100%, while solar output drops ~30%. Your hybrid system balances both sources automatically, maintaining steady energy generation year-round.
                  </p>
                </div>
              </div>

              {/* Suggested Questions */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs font-semibold text-gray-600 mb-3">Suggested Questions:</p>
                <div className="space-y-2">
                  <button className="w-full text-left text-sm bg-white border border-gray-300 rounded-lg p-2 hover:bg-gray-50 transition-colors text-gray-700">
                    💡 How to maximize energy output?
                  </button>
                  <button className="w-full text-left text-sm bg-white border border-gray-300 rounded-lg p-2 hover:bg-gray-50 transition-colors text-gray-700">
                    💰 What&apos;s the payback period?
                  </button>
                  <button className="w-full text-left text-sm bg-white border border-gray-300 rounded-lg p-2 hover:bg-gray-50 transition-colors text-gray-700">
                    🎯 Maintenance requirements?
                  </button>
                </div>
              </div>
            </div>

            {/* Input Field */}
            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask your question..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FC7019]"
                />
                <button className="bg-[#FC7019] hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

  {/* STEP 4: Merchant Network (Partners) */}
      <div className="mt-20">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center px-4 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
            Step 4: Merchant Network
          </span>
          <h3 className="mt-4 text-3xl font-extrabold text-[#131B28]">Local Merchant Partnership</h3>
          <p className="mt-4 text-lg text-gray-700">We partner with local SMEs so residents can spend energy credits at nearby shops, markets, and service providers — supporting local commerce while increasing utility for IslaGrid credits.</p>
        </div>
        <div className="mt-8 flex flex-wrap justify-center items-center gap-6">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 w-44 h-44 flex flex-col justify-center items-center text-center">
            <Store className="h-10 w-10 text-[#FC7019] mb-3" />
            <p className="text-gray-900 font-semibold">Barangay Co-op Mart</p>
            <p className="text-xs text-gray-500 mt-1">Everyday essentials paid with IslaGrid credits</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 w-44 h-44 flex flex-col justify-center items-center text-center">
            <Coffee className="h-10 w-10 text-[#FC7019] mb-3" />
            <p className="text-gray-900 font-semibold">Coastal Brew Collective</p>
            <p className="text-xs text-gray-500 mt-1">Neighborhood café honoring clean-energy rewards</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 w-44 h-44 flex flex-col justify-center items-center text-center">
            <Stethoscope className="h-10 w-10 text-[#FC7019] mb-3" />
            <p className="text-gray-900 font-semibold">HealthLink Pharmacy Coop</p>
            <p className="text-xs text-gray-500 mt-1">Affordable wellness supported by local energy credits</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default FeaturesSection;


