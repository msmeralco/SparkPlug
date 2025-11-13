"use client";

import {
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";

const DEMO_GENERATION_DELAY_MS = 2500;

const ProposalForm = () => {
  const [location, setLocation] = useState("");
  const [resource, setResource] = useState("Strong Sunlight (Solar)");
  const [population, setPopulation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<ReactNode>("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    setTimeout(() => {
      setIsLoading(false);
      setMessage(
        <div className="text-orange-800 bg-orange-100 border border-orange-300 p-3 rounded-lg">
          <h5 className="font-bold">Proposal Generated! (Demo)</h5>
          <p className="text-sm">
            Your customized cost-benefit analysis and proposal document are
            ready for download.
          </p>
        </div>
      );
    }, DEMO_GENERATION_DELAY_MS);
  };

  const loadingMessage = (
    <div className="flex items-center justify-center text-blue-600">
      <svg
        className="animate-spin -ml-1 mr-3 h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <span className="font-medium">
        Analyzing local factors for {location || "your area"}...
      </span>
    </div>
  );

  return (
    <div className="bg-[#FFFDFA] rounded-2xl shadow-2xl border p-8">
      <h4 className="text-xl font-bold text-[#131B28]">
        Try the Proposal Generator (Demo)
      </h4>
      <p className="text-sm text-gray-500 mb-6">
        Enter your community's data to start.
      </p>
      <form id="proposal-form" className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Barangay / LGU Location
          </label>
          <input
            type="text"
            id="location"
            placeholder="e.g., Barangay San Juan, Rizal"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FC7019] focus:border-[#FC7019]"
            value={location}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setLocation(event.target.value)
            }
          />
        </div>
        <div>
          <label
            htmlFor="resource"
            className="block text-sm font-medium text-gray-700"
          >
            Available Natural Resource
          </label>
          <select
            id="resource"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FC7019] focus:border-[#FC7019]"
            value={resource}
            onChange={(event: ChangeEvent<HTMLSelectElement>) =>
              setResource(event.target.value)
            }
          >
            <option>Strong Sunlight (Solar)</option>
            <option>Nearby River (Hydro)</option>
            <option>Coastal/Hilltop (Wind)</option>
            <option>Hybrid / Unsure</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="population"
            className="block text-sm font-medium text-gray-700"
          >
            Community Population
          </label>
          <input
            type="number"
            id="population"
            placeholder="e.g., 5000"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FC7019] focus:border-[#FC7019]"
            value={population}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setPopulation(event.target.value)
            }
          />
        </div>
        <button
          id="generate-btn"
          type="submit"
          className={`w-full bg-[#FC7019] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:brightness-95 transition-all ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate Proposal"}
        </button>
      </form>
      <div id="proposal-message" className="mt-4 text-center">
        {isLoading ? loadingMessage : message}
      </div>
    </div>
  );
};

export default ProposalForm;
