import express, { NextFunction, Request, Response } from "express";
import { contextRouter } from "./routes/userContextRoutes.js";
import cors from "cors";
import authenticate from "./middlewares/authenticate.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { chatRouter } from "./routes/chatRoutes.js";
import renewableDataRoutes from "./routes/renewableDataRoutes.js";

// CORS config
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

import aiRouter from "./routes/aiRouter.js";

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 8000;

// Allow ALL origins - no restrictions
app.use(cors());

app.use(authenticate);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// JSON parsing error handler
app.use(
  (
    err: SyntaxError & { status?: number; body?: string },
    _req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
      return res.status(400).json({
        error: "Invalid JSON format",
        message:
          "Please check your JSON syntax. Common issues include missing quotes around property names, trailing commas, or malformed structure.",
        example: {
          correct: { message: "What is your experience?" },
          received: err.body ? err.body.slice(0, 100) : "Invalid JSON",
        },
        timestamp: new Date().toISOString(),
      });
    }
    return next(err);
  }
);

app.use("/api/chats", chatRouter);

app.get("/", (_req, res) => {
  res.send("Welcome to the IslaGrid API server.");
});

app.use("/api/contexts", contextRouter);
app.use("/api/v1", aiRouter);
app.use("/api/renewables", renewableDataRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});