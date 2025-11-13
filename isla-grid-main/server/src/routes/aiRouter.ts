import { Router } from "express";
import {
  analyticsHandler,
  authenticateAPI,
  chatHandler,
  docsHandler,
  generateProposalHandler,
  healthHandler,
  rateLimit,
  rootHandler,
} from "../controllers/aiController.js";

const router = Router();

router.post(
  "/generate-proposal",
  rateLimit,
  authenticateAPI,
  generateProposalHandler
);
router.post("/chat", rateLimit, authenticateAPI, chatHandler);
router.get("/health", healthHandler);
router.get("/analytics", authenticateAPI, analyticsHandler);
router.get("/docs", docsHandler);
router.get("/", rootHandler);

export default router;
