"use client";

import React, { useState } from "react";
import {
  FileText,
  Zap,
  DollarSign,
  Users,
  Download,
  RefreshCw,
  TrendingUp,
  MapPin,
  BarChart3,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  generateProposal,
  type Barangay,
  type EnergyMix,
  type Financials,
} from "@/lib/api";

// ===== DATA STRUCTURES =====
const SAMPLE_BARANGAYS: Barangay[] = [
  {
    name: "San Isidro",
    province: "Laguna",
    population: 2500,
    households: 500,
    avgDailyDemandKWh: 3000,
    solarIrradiance: 4.5,
    hasRiverAccess: true,
    avgWindSpeed: 3.2,
    gridConnected: true,
    currentElectricityCostPerKWh: 12.5,
  },
  {
    name: "Malvar",
    province: "Batangas",
    population: 4000,
    households: 800,
    avgDailyDemandKWh: 5000,
    solarIrradiance: 5.0,
    hasRiverAccess: false,
    avgWindSpeed: 4.5,
    gridConnected: true,
    currentElectricityCostPerKWh: 13.2,
  },
  {
    name: "Buenavista",
    province: "Quezon",
    population: 1800,
    households: 360,
    avgDailyDemandKWh: 2200,
    solarIrradiance: 4.8,
    hasRiverAccess: true,
    avgWindSpeed: 2.8,
    gridConnected: false,
    currentElectricityCostPerKWh: 18.0,
  },
];

// ===== MAIN APP =====
export default function BarangayREPlatform() {
  const [step, setStep] = useState(1);
  const [selectedBarangay, setSelectedBarangay] = useState<Barangay>(
    SAMPLE_BARANGAYS[0]
  );
  const [demandMultiplier, setDemandMultiplier] = useState(1.0);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [proposal, setProposal] = useState("");
  const [energyMix, setEnergyMix] = useState<EnergyMix | null>(null);
  const [financials, setFinancials] = useState<Financials | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateProposalHandler = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await generateProposal({
        barangay: selectedBarangay,
        demandMultiplier,
        notes: notes || undefined,
      });

      setProposal(response.proposal);
      setEnergyMix(response.energyMix);
      setFinancials(response.financials);
      setStep(3);

      console.log("Proposal generated via:", response.metadata.source);
    } catch (err) {
      const errorMessage =
        (err as Error).message || "Failed to generate proposal";
      setError(errorMessage);
      console.error("Proposal generation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const downloadProposal = () => {
    if (!energyMix || !financials) {
      console.error("Cannot download: missing data");
      return;
    }

    const doc = `${proposal}

---
TECHNICAL SPECIFICATIONS
Solar: ${energyMix.solar.capacityKW} kW | Hydro: ${
      energyMix.hydro.capacityKW
    } kW | Wind: ${energyMix.wind.capacityKW} kW
Investment: ₱${financials.totalInvestment.toLocaleString()} | Payback: ${
      financials.paybackYears
    } years`;

    const blob = new Blob([doc], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedBarangay.name}_RE_Proposal.md`;
    a.click();
  };

  // Chart data
  const capacityData = [
    {
      name: "Solar",
      value: energyMix?.solar.capacityKW || 0,
      color: "#f59e0b",
    },
    {
      name: "Hydro",
      value: energyMix?.hydro.capacityKW || 0,
      color: "#3b82f6",
    },
    { name: "Wind", value: energyMix?.wind.capacityKW || 0, color: "#10b981" },
  ].filter((d) => d.value > 0);

  const capexData = [
    { name: "Solar", value: (energyMix?.solar.capex || 0) / 1000000 },
    { name: "Hydro", value: (energyMix?.hydro.capex || 0) / 1000000 },
    { name: "Wind", value: (energyMix?.wind.capex || 0) / 1000000 },
    { name: "Battery", value: (energyMix?.battery.capex || 0) / 1000000 },
  ].filter((d) => d.value > 0);

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="w-10 h-10 text-green-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Barangay RE Generator
              </h1>
              <p className="text-sm text-gray-600">
                AI-Powered Community Energy Planning
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step >= s
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* STEP 1: Select Barangay */}
        {step === 1 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold mb-2 text-gray-900">
                Select Your Barangay
              </h2>
              <p className="text-gray-600 mb-8">
                Choose a community to generate a customized renewable energy
                proposal
              </p>

              <div className="space-y-4">
                {SAMPLE_BARANGAYS.map((brgy) => (
                  <div
                    key={brgy.name}
                    onClick={() => setSelectedBarangay(brgy)}
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedBarangay.name === brgy.name
                        ? "border-green-600 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-5 h-5 text-gray-500" />
                          <h3 className="text-xl font-semibold text-gray-900">
                            {brgy.name}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {brgy.province}
                        </p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                          <div>
                            <span className="text-gray-500">Population:</span>{" "}
                            <span className="font-medium">
                              {brgy.population}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Households:</span>{" "}
                            <span className="font-medium">
                              {brgy.households}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Daily Demand:</span>{" "}
                            <span className="font-medium">
                              {brgy.avgDailyDemandKWh} kWh
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Solar:</span>{" "}
                            <span className="font-medium">
                              {brgy.solarIrradiance} kWh/m²/day
                            </span>
                          </div>
                        </div>
                      </div>
                      {selectedBarangay.name === brgy.name && (
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full mt-8 bg-linear-to-r from-green-600 to-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-green-700 hover:to-blue-700 transition-all"
              >
                Continue to Configuration →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Configure */}
        {step === 2 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold mb-2 text-gray-900">
                Configure Requirements
              </h2>
              <p className="text-gray-600 mb-8">
                Adjust energy demand and add special notes
              </p>

              <div className="space-y-8">
                <div className="p-6 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-gray-900">
                      {selectedBarangay.name}, {selectedBarangay.province}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {selectedBarangay.households}
                      </div>
                      <div className="text-gray-600">Households</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {selectedBarangay.avgDailyDemandKWh}
                      </div>
                      <div className="text-gray-600">kWh/day</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        ₱{selectedBarangay.currentElectricityCostPerKWh}
                      </div>
                      <div className="text-gray-600">per kWh</div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-4">
                    Demand Multiplier:{" "}
                    <span className="text-green-600">
                      {demandMultiplier.toFixed(1)}x
                    </span>
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={demandMultiplier}
                    onChange={(e) =>
                      setDemandMultiplier(parseFloat(e.target.value))
                    }
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>0.5x (Conservative)</span>
                    <span className="font-semibold text-green-600">
                      {Math.round(
                        selectedBarangay.avgDailyDemandKWh * demandMultiplier
                      )}{" "}
                      kWh/day
                    </span>
                    <span>2.0x (Growth)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-2">
                    Additional Requirements (Optional)
                  </label>
                  <textarea
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-green-600 focus:outline-none"
                    rows={4}
                    placeholder="e.g., Priority on solar due to available land, Need 24/7 power for medical clinic..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                >
                  ← Back
                </button>
                <button
                  onClick={generateProposalHandler}
                  disabled={loading}
                  className="flex-1 bg-linear-to-r from-green-600 to-blue-600 text-white py-4 rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Generate Proposal
                    </>
                  )}
                </button>
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-800 text-sm">
                    <strong>Error:</strong> {error}
                  </p>
                  <p className="text-red-600 text-xs mt-1">
                    Make sure the backend server is running at{" "}
                    {process.env.NEXT_PUBLIC_API_URL || "https://isla-gridserver.vercel.app/"}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: Results */}
        {step === 3 && energyMix && financials && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                  <span className="text-sm font-medium text-gray-500">
                    Coverage
                  </span>
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {energyMix.total.coverage}%
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <Zap className="w-8 h-8 text-blue-600" />
                  <span className="text-sm font-medium text-gray-500">
                    Capacity
                  </span>
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {energyMix.total.capacityKW} kW
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="w-8 h-8 text-purple-600" />
                  <span className="text-sm font-medium text-gray-500">
                    Investment
                  </span>
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  ₱{(energyMix.total.totalCapex / 1000000).toFixed(1)}M
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <BarChart3 className="w-8 h-8 text-orange-600" />
                  <span className="text-sm font-medium text-gray-500">
                    Payback
                  </span>
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {financials.paybackYears} yrs
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Capacity Mix</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={capacityData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry: any) => {
                        const name = entry?.name ?? "";
                        const percent =
                          typeof entry?.percent === "number"
                            ? Math.round(entry.percent * 100)
                            : 0;
                        return `${name} ${percent}%`;
                      }}
                      dataKey="value"
                    >
                      {capacityData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => `${v.toFixed(1)} kW`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Investment Breakdown
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={capexData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis
                      label={{
                        value: "Million PHP",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip formatter={(v: number) => `₱${v.toFixed(2)}M`} />
                    <Bar dataKey="value" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Proposal */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Generated Proposal
                </h3>
                <button
                  onClick={downloadProposal}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Download
                </button>
              </div>
              <div className="prose prose-sm max-w-none whitespace-pre-wrap text-gray-800 bg-gray-50 p-6 rounded-lg max-h-96 overflow-y-auto">
                {proposal}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setStep(1);
                  setProposal("");
                }}
                className="flex-1 py-4 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50"
              >
                New Proposal
              </button>
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
              >
                Adjust Parameters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
