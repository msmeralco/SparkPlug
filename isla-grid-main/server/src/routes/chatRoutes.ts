import { RequestHandler, Router } from "express";
import { db } from "../lib/firebase.js";
import {
  createErrorApiResponse,
  createSuccessApiResponse,
} from "../utils/apiUtils.js";
import { Chat, CreateMessageDTO, Message } from "../types/chatTypes.js";
import { ApiRequest } from "../types/apiTypes.js";
import { randomUUID } from "crypto";

export const chatRouter = Router();

/**
 * CREATE CHAT
 * POST /api/chat
 * Creates a new chat for authenticated user
 */
chatRouter.post("/", async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json(createErrorApiResponse("Unauthorized"));
  }

  const chatId = randomUUID();
  const now = Date.now();

  const newChat: Chat = {
    chatId,
    userId,
    messages: [],
    createdAt: now,
    updatedAt: now,
  };

  await db.collection("chats").doc(chatId).set(newChat);

  return res
    .status(201)
    .json(createSuccessApiResponse("Chat created successfully", newChat));
});

/**
 * GET ALL CHATS
 * GET /api/chat
 * Returns all chats belonging to the authenticated user
 */
chatRouter.get("/", async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json(createErrorApiResponse("Unauthorized"));
  }

  const snapshot = await db
    .collection("chats")
    .where("userId", "==", userId)
    .get();
  const chats: Chat[] = snapshot.docs.map((doc) => doc.data() as Chat);

  // sort chats based on createdAt to show the latest first
  chats.sort((a, b) => b.updatedAt - a.updatedAt);

  return res
    .status(200)
    .json(createSuccessApiResponse("Chats fetched successfully", chats));
});

/**
 * GET CHAT BY ID
 * GET /api/chat/:chatId
 */
chatRouter.get("/:chatId", async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json(createErrorApiResponse("Unauthorized"));
  }

  const { chatId } = req.params;

  const doc = await db.collection("chats").doc(chatId).get();

  if (!doc.exists) {
    return res.status(404).json(createErrorApiResponse("Chat not found"));
  }

  const chat = doc.data() as Chat;

  // chat is not owned by the authenticated user
  if (chat.userId !== userId) {
    return res.status(403).json(createErrorApiResponse("Unauthorized"));
  }

  return res
    .status(200)
    .json(createSuccessApiResponse("Chat fetched successfully", chat));
});

/**
 * ADD MESSAGE TO CHAT
 * PATCH /api/chat/:chatId
 * Request Body: ApiRequest<{ message: Message }>
 */
chatRouter.patch("/:chatId", async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json(createErrorApiResponse("Unauthorized"));
  }

  const { chatId } = req.params;
  const body = req.body as ApiRequest<CreateMessageDTO>;
  const createMessageDTO = body.payload;

  if (!createMessageDTO) {
    return res
      .status(400)
      .json(createErrorApiResponse("Missing message payload"));
  }

  const message: Message = {
    ...createMessageDTO,
    messageId: randomUUID(),
    timestamp: Date.now(),
    chatId: chatId,
  };

  const docRef = db.collection("chats").doc(chatId);
  const doc = await docRef.get();

  if (!doc.exists) {
    return res.status(404).json(createErrorApiResponse("Chat not found"));
  }

  const chat = doc.data() as Chat;

  // chat is not owned by the authenticated user
  if (chat.userId !== userId) {
    return res.status(403).json(createErrorApiResponse("Unauthorized"));
  }

  const updatedMessages = [...chat.messages, message];
  const updatedAt = Date.now();

  const updatedChat: Chat = {
    ...chat,
    messages: updatedMessages,
    updatedAt,
  };

  await docRef.update(updatedChat);

  return res
    .status(200)
    .json(createSuccessApiResponse("Message added successfully", updatedChat));
});

/**
 * DELETE CHAT
 * DELETE /api/chat/:chatId
 */
chatRouter.delete("/:chatId", async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json(createErrorApiResponse("Unauthorized"));
  }

  const { chatId } = req.params;

  const docRef = db.collection("chats").doc(chatId);
  const doc = await docRef.get();

  if (!doc.exists) {
    return res.status(404).json(createErrorApiResponse("Chat not found"));
  }

  const chat = doc.data() as Chat;

  if (chat.userId !== userId) {
    return res.status(403).json(createErrorApiResponse("Unauthorized"));
  }

  await docRef.delete();

  return res
    .status(200)
    .json(createSuccessApiResponse("Chat deleted successfully", chat));
});
