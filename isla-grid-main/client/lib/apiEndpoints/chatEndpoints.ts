import { ApiRequest, ApiResponse } from "@/types/apiTypes";
import { Chat, CreateMessageDTO, Message } from "@/types/chatTypes";

/**
 * creates a chat for the authenticated user
 */
export const initializeChat = async (authToken: string): Promise<Chat> => {
  const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chats`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${authToken}`
    },
  });

  if (!result.ok) {
    const resultPayload = (await result.json()) as ApiResponse;
    throw new Error(resultPayload.message);
  }

  const resultPayload = (await result.json()) as ApiResponse<Chat>;

  const newContext = resultPayload.data as Chat;

  return newContext;
};

export const listAllChatsOfUser = async (
  authToken: string
): Promise<Chat[]> => {
  const result = await fetch( `${process.env.NEXT_PUBLIC_API_URL}/api/chats`, {
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

  const resultPayload = (await result.json()) as ApiResponse<Chat[]>;

  const newContext = resultPayload.data as Chat[];

  return newContext;
};

export const getSpecificChat = async (
  authToken: string,
  chatId: string
): Promise<Chat> => {
  const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chats/${chatId}`, {
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

  const resultPayload = (await result.json()) as ApiResponse<Chat>;

  const newContext = resultPayload.data as Chat;

  return newContext;
};

export const pushMessageToChat = async (
  authToken: string,
  chatId: string,
  message: CreateMessageDTO
): Promise<Chat> => {
  const requestBody: ApiRequest<CreateMessageDTO> = {
    payload: message,
  };
  const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chats/${chatId}`, {
    method: "PATCH",
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

  const resultPayload = (await result.json()) as ApiResponse<Chat>;

  const newContext = resultPayload.data as Chat;

  return newContext;
};

export const deleteChat = async (
  authToken: string,
  chatId: string
): Promise<Chat> => {
  const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chats/${chatId}`, {
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

  const resultPayload = (await result.json()) as ApiResponse<Chat>;

  const newContext = resultPayload.data as Chat;

  return newContext;
};