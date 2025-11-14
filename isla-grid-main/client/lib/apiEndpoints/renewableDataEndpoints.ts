/**
 * Renewable Data API Endpoints
 *
 * This module handles API calls to the renewable energy data endpoints.
 *
 * Environment Configuration:
 * - Development: Uses NEXT_PUBLIC_API_URL or defaults to http://localhost:8000/api/v1
 * - Production: Set NEXT_PUBLIC_API_URL to your deployed backend URL (e.g., https://your-api.com/api/v1)
 *
 * The SERVER_BASE_URL automatically strips the /api/v1 suffix to access non-v1 endpoints like /api/renewables
 */

import { ApiResponse } from "@/types/apiTypes";

// Get the base server URL (without /api/v1 suffix)
const getServerBaseUrl = () => {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
  // Remove /api/v1 suffix if present to get the base server URL
  return apiUrl.replace(/\/api\/v1$/, "");
};

const SERVER_BASE_URL = getServerBaseUrl();

export interface RenewableMixData {
  province: string;
  biomass: number;
  solar: number;
  hydropower: number;
  wind: number;
}

/**
 * Fetches the renewable energy mix data for a specific province
 */
export const getRenewableMixByProvince = async (
  province: string
): Promise<RenewableMixData> => {
  const params = new URLSearchParams({ province });
  const result = await fetch(
    `${SERVER_BASE_URL}/api/renewables/mix?${params.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!result.ok) {
    const errorText = await result.text();
    throw new Error(`Failed to fetch renewable mix: ${errorText}`);
  }

  const data: RenewableMixData = await result.json();
  return data;
};
