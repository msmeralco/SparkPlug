import { Router } from "express";
import { db } from "../lib/firebase.js";
import {
  createApiResponse,
  createErrorApiResponse,
  createSuccessApiResponse,
} from "../utils/apiUtils.js";
import { ApiRequest } from "../types/apiTypes.js";
import { CreateUserContextDTO, UserContext } from "../types/userContextTypes.js";

export const contextRouter = Router();

/**
 * CREATE CONTEXT
 * POST /api/context
 * Permissions: Authenticated user (or Admin)
 * Request Body: ApiRequestBody<Context>
 * Response Body: ApiResponseBody<Context>
 */
contextRouter.post("/", async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json(createErrorApiResponse("Unauthorized"));
  }

  const body = req.body as ApiRequest<CreateUserContextDTO>;
  const createUserContextDTO = body.payload;
  if (!createUserContextDTO) {
    return res
      .status(400)
      .json(createErrorApiResponse("Missing context payload"));
  }

  const context = {
    ...createUserContextDTO,
    userId,
  };

  await db.collection("contexts").doc(userId).set(context);

  return res
    .status(201)
    .json(createApiResponse(true, "Context created successfully", context));
});

/**
 * GET CONTEXT (READ)
 * GET /api/context/:userId
 */
contextRouter.get("/", async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json(createErrorApiResponse("Unauthorized"));
  }

  const doc = await db.collection("contexts").doc(userId).get();

  if (!doc.exists) {
    return res.status(404).json(createErrorApiResponse("Context not found"));
  }

  const data = doc.data() as UserContext;

  return res
    .status(200)
    .json(createSuccessApiResponse("Context fetched successfully", data));
});

/**
 * UPDATE CONTEXT
 * PATCH /api/context/:userId
 * Request Body: ApiRequestBody<Partial<Context>>
 *
 * !!! COMPLETE REPLACEMENT OF CURRENT CONTEXT
 * recommended workflow - get context -> update locally -> put on database
 */
contextRouter.put("/", async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json(createErrorApiResponse("Unauthorized"));
  }

  const body = req.body as ApiRequest<UserContext>;
  const updatedUserContext = body.payload;

  if (!updatedUserContext) {
    return res
      .status(400)
      .json(createErrorApiResponse("Missing context payload"));
  }

  const docRef = db.collection("contexts").doc(userId);
  const doc = await docRef.get();

  if (!doc.exists) {
    return res.status(404).json(createErrorApiResponse("Context not found"));
  }

  await docRef.update(updatedUserContext);

  return res
    .status(200)
    .json(
      createSuccessApiResponse(
        "Context updated successfully",
        updatedUserContext
      )
    );
});

/**
 * DELETE CONTEXT
 * DELETE /api/context/:userId
 */
contextRouter.delete("/", async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json(createErrorApiResponse("Unauthorized"));
  }

  const docRef = db.collection("contexts").doc(userId);
  const doc = await docRef.get();

  if (!doc.exists) {
    return res.status(404).json(createErrorApiResponse("Context not found"));
  }

  const context = doc.data() as UserContext;

  await docRef.delete();

  return res
    .status(200)
    .json(createSuccessApiResponse("Context deleted successfully", context));
});
