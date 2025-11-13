import { ApiRequest, ApiResponse } from "@/types/apiTypes";
import { Context } from "@/types/userContextsType";


export const createContext = async (authToken: string, context: Context) => {
  const requestBody: ApiRequest<Context> = {
    payload: context,
  };

  const result = await fetch("http://localhost:8000/api/contexts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authToken: authToken,
    },
    body: JSON.stringify(requestBody),
  });

  if (!result.ok) {
    const resultPayload = (await result.json()) as ApiResponse;
    throw new Error(resultPayload.message);
  }

  const resultPayload = (await result.json()) as ApiResponse<Context>;

  const newContext = resultPayload.data;

  return newContext;
};

export const getContext = async (authToken: string, userId: string) => {
  const result = await fetch(`http://localhost:8000/api/contexts/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authToken: authToken,
    },
  });

  if (!result.ok) {
    const resultPayload = (await result.json()) as ApiResponse;
    throw new Error(resultPayload.message);
  }

  const resultPayload = (await result.json()) as ApiResponse<Context>;

  const newContext = resultPayload.data;

  return newContext;
};

export const updateContext = async (authToken: string, newContext: Context) => {
  const requestBody: ApiRequest<Context> = {
    payload: newContext,
  };

  const userId = newContext.userId
  const result = await fetch(`http://localhost:8000/api/contexts/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      authToken: authToken,
    },
    body: JSON.stringify(requestBody),
  });

  if (!result.ok) {
    const resultPayload = (await result.json()) as ApiResponse;
    throw new Error(resultPayload.message);
  }

  const resultPayload = (await result.json()) as ApiResponse<Context>;

  const updatedContext = resultPayload.data;

  return updatedContext;
};

export const deleteContext = async (authToken: string, userId: string) => {
  const result = await fetch(`http://localhost:8000/api/contexts/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authToken: authToken,
    },
  });

  if (!result.ok) {
    const resultPayload = (await result.json()) as ApiResponse;
    throw new Error(resultPayload.message);
  }

  const resultPayload = (await result.json()) as ApiResponse<Context>;

  const deletedContext = resultPayload.data;

  return deletedContext;
};
