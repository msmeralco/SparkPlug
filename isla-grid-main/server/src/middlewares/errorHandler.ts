import { Request, Response, NextFunction } from "express";
import {
  createErrorApiResponse,
} from "../utils/apiUtils.js";

/**
 * Catch-all error handling middleware
 * This should be the last middleware registered.
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => { 

  // If headers are already sent, delegate to default Express handler
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.status || err.statusCode || 500;
  const message =
    err.message || "Internal server error";

  res.status(statusCode).json(createErrorApiResponse(message));
};
