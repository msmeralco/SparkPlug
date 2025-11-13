import { ApiRequest, ApiResponse } from "@/types/apiTypes";
import { CreateUserContextDTO, UserContext } from "@/types/userContextsType";

export const createUserContext = async (
  authToken: string,
  context: CreateUserContextDTO
) => {
  const requestBody: ApiRequest<CreateUserContextDTO> = {
    payload: context,
  };

  const result = await fetch("http://localhost:8000/api/contexts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${authToken}`
    },
    body: JSON.stringify(requestBody),
  });

  if (!result.ok) {
    const resultPayload = (await result.json()) as ApiResponse;
    throw new Error(resultPayload.message);
  }

  const resultPayload = (await result.json()) as ApiResponse<UserContext>;

  const newContext = resultPayload.data;

  return newContext;
};

export const getUserContext = async (authToken: string) => {
  const result = await fetch(`http://localhost:8000/api/contexts`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${authToken}`
    },
  });

  if (!result.ok) {
    const resultPayload = (await result.json()) as ApiResponse;
    throw new Error(resultPayload.message);
  }

  const resultPayload = (await result.json()) as ApiResponse<UserContext>;

  const newContext = resultPayload.data;

  return newContext;
};

export const updateUserContext = async (
  authToken: string,
  newContext: CreateUserContextDTO
) => {
  const requestBody: ApiRequest<CreateUserContextDTO> = {
    payload: newContext,
  };

  const result = await fetch(`http://localhost:8000/api/contexts/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${authToken}`
    },
    body: JSON.stringify(requestBody),
  });

  if (!result.ok) {
    const resultPayload = (await result.json()) as ApiResponse;
    throw new Error(resultPayload.message);
  }

  const resultPayload = (await result.json()) as ApiResponse<UserContext>;

  const updatedContext = resultPayload.data;

  return updatedContext;
};

export const deleteUserContext = async (authToken: string) => {
  const result = await fetch(`http://localhost:8000/api/contexts/ `, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${authToken}`
    },
  });

  if (!result.ok) {
    const resultPayload = (await result.json()) as ApiResponse;
    throw new Error(resultPayload.message);
  }

  const resultPayload = (await result.json()) as ApiResponse<UserContext>;

  const deletedContext = resultPayload.data;

  return deletedContext;
};
