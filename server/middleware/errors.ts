import type { Request, Response, NextFunction } from "express";

// 404 catch-all
export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ error: "Not found" });
}

// Global error handler
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(err.stack);

  const status = "status" in err ? (err as { status: number }).status : 500;
  const message =
    process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message;

  res.status(status).json({ error: message });
}
