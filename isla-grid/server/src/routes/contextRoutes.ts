import { Router } from "express";
import { db } from "../lib/firebase.js";
import {
  createApiResponse,
  createErrorApiResponse,
  createSuccessApiResponse,
} from "../utils/apiUtils.js";
import { ApiRequest } from "../types/apiTypes.js";
import { Context } from "../types/userContextTypes.js";

export const contextRouter = Router();

/**
 * CREATE CONTEXT
 * POST /api/context
 * Permissions: Authenticated user (or Admin)
 * Request Body: ApiRequestBody<Context>
 * Response Body: ApiResponseBody<Context>
 */
contextRouter.post("/", async (req, res) => {
  try {
    const body = req.body as ApiRequest<Context>;
    const context = body.payload;

    if (
      !context.userId ||
      !context.contextValue ||
      typeof context.contextValue.location !== "string" ||
      typeof context.contextValue.monthlyIncome !== "number" ||
      typeof context.contextValue.monthlyExpenses !== "number" ||
      !Array.isArray(context.contextValue.appliances)
    ) {
      return res
        .status(400)
        .json(
          createErrorApiResponse("Invalid or missing fields in request body")
        );
    }

    await db.collection("contexts").doc(context.userId).set(context);

    return res
      .status(201)
      .json(createApiResponse(true, "Context created successfully", context));
  } catch (error) {
    console.error("Error creating context:", error);
    return res
      .status(500)
      .json(createErrorApiResponse("Internal server error"));
  }
});

/**
 * GET CONTEXT (READ)
 * GET /api/context/:userId
 */
contextRouter.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const doc = await db.collection("contexts").doc(userId).get();

    if (!doc.exists) {
      return res.status(404).json(createErrorApiResponse("Context not found"));
    }

    const data = doc.data() as Context;

    return res
      .status(200)
      .json(createSuccessApiResponse("Context fetched successfully", data));
  } catch (error) {
    console.error("Error fetching context:", error);
    return res
      .status(500)
      .json(createErrorApiResponse("Internal server error"));
  }
});

/**
 * UPDATE CONTEXT
 * PATCH /api/context/:userId
 * Request Body: ApiRequestBody<Partial<Context>>
 *
 * !!! COMPLETE REPLACEMENT OF CURRENT CONTEXT
 * recommended workflow - get context -> update locally -> put on database
 */
contextRouter.put("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const body = req.body as ApiRequest<Context>;
    const updatedData = body.payload;

    console.log("updatedData", updatedData);

    const docRef = db.collection("contexts").doc(userId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json(createErrorApiResponse("Context not found"));
    }

    await docRef.update(updatedData);

    return res
      .status(200)
      .json(
        createSuccessApiResponse("Context updated successfully", updatedData)
      );
  } catch (error) {
    console.error("Error updating context:", error);
    return res
      .status(500)
      .json(createErrorApiResponse("Internal server error"));
  }
});

/**
 * DELETE CONTEXT
 * DELETE /api/context/:userId
 */
contextRouter.delete("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const docRef = db.collection("contexts").doc(userId);
    const doc = await docRef.get();
    const context = doc.data() as Context;

    if (!doc.exists) {
      return res.status(404).json(createErrorApiResponse("Context not found"));
    }

    await docRef.delete();

    return res
      .status(200)
      .json(createSuccessApiResponse("Context deleted successfully", context));
  } catch (error) {
    console.error("Error deleting context:", error);
    return res
      .status(500)
      .json(createErrorApiResponse("Internal server error"));
  }
});
