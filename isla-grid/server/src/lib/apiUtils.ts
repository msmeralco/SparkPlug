import { ApiResponse } from "../types/apiTypes.js";


export function createApiResponse<T>(
  success: boolean,
  message: string,
  data?: T
): ApiResponse<T> {
  return {
    success,
    message,
    data,
  };
}

export function createSuccessApiResponse<T>(
  message: string,
  data?: T
): ApiResponse<T> {
  return createApiResponse(true, message, data);
}

export function createErrorApiResponse(message: string): ApiResponse {
  return createApiResponse(false, message);
}

