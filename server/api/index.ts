import { Router } from "express";

const api = Router();

api.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Add your API routes here
// api.use("/users", usersRouter);
// api.use("/posts", postsRouter);

export default api;
