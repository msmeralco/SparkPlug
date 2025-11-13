import { Router } from "express";
import { ApiRequest } from "../types/apiTypes.js";
import {
  CreateReadingDTO,
  Reading,
  ReadingCore,
} from "../types/readingTypes.js";
import { randomUUID } from "crypto";
import { createApiResponse } from "../lib/apiUtils.js";
import { db } from "../lib/firebase.js";

export const readingsRouter = Router();

/**
 * CREATE A READING
HTTP Request: 
POST /api/readings
Permissions: 
Admin only
Path Parameters: 
Query Parameters: 
Request Header: 
authToken
Request Body: 
ApiRequestBody<CreateReadingDTO>
Response body: 
ApiResponseBody<Reading>

 */
readingsRouter.post("/", async (req, res) => {
  // ✅ Validate request body
    const body = req.body as ApiRequest<CreateReadingDTO>;
    const createReadingDTO = body.payload;

  // mock reading dto for testing
//   const createReadingDTO: CreateReadingDTO = {
//     "communityId": "communityId",
//     "energyProduction": 1,
//     "energyRate": 2,
//     "dateStart": 3,
//     "dateEnd": 4,
//     "pesoEquivalent": 5,
//   };

  if (
    !createReadingDTO.communityId ||
    typeof createReadingDTO.energyProduction !== "number" ||
    typeof createReadingDTO.energyRate !== "number" ||
    typeof createReadingDTO.dateStart !== "number" ||
    typeof createReadingDTO.dateEnd !== "number" ||
    typeof createReadingDTO.pesoEquivalent !== "number"
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid or missing fields in request body.",
    });
  }

  const readingId = randomUUID();

  // create reading core
  const readingCore: ReadingCore = {
    ...createReadingDTO,
    distribution: [
      {
        id: "none",
        name: "unassigned",
        stocks: 0,
      },
    ],
    status: "active",
    readingId: readingId,
  };

  // creating complete reading
  const newReading: Reading = {
    ...readingCore,
    id: readingId,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  // ✅ Save to database
  // await readingsDB.insert(newReading);

  await db.collection("readings").doc(readingId).set(newReading);

  // ✅ Respond
  return res
    .status(201)
    .json(createApiResponse(true, "Reading created successfully", newReading));
});
