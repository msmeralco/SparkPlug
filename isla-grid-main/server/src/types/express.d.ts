import "express";
import { UserRecord } from "firebase-admin/auth";

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
    user?: UserRecord;
  }
}