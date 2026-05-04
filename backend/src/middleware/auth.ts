import type { Request, Response, NextFunction } from "express";

export function requireApiKey(req: Request, res: Response, next: NextFunction) {
  const key = req.headers["x-api-key"];
  const adminKey = process.env.ADMIN_API_KEY;

  if (!adminKey) {
    return res.status(500).json({ error: "Server misconfigured: ADMIN_API_KEY not set" });
  }

  if (!key || key !== adminKey) {
    return res.status(401).json({ error: "Invalid or missing API key" });
  }

  next();
}
