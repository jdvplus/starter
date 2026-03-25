import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import express, { type Router } from "express";

export function securityMiddleware(): Router {
  const router = express.Router();

  // Security headers
  router.use(helmet());

  // CORS — allow Vite dev server in development, same-origin in production
  const origin =
    process.env.NODE_ENV === "production"
      ? false
      : process.env.CLIENT_ORIGIN || "http://localhost:5173";

  router.use(cors({ origin, credentials: true }));

  // Rate limiting on API routes
  router.use(
    "/api",
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      limit: 100,
      standardHeaders: "draft-7",
      legacyHeaders: false,
      message: { error: "Too many requests, please try again later." },
    })
  );

  return router;
}
