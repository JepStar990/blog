import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { createServer } from "http";
import publicRoutes from "./routes/public.js";
import adminRoutes from "./routes/admin.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

// Trust proxy (Render, Heroku, etc. sit behind a reverse proxy)
app.set("trust proxy", 1);

// Security
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "X-API-Key", "X-DeepSeek-Key"],
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false },
});
app.use("/api", generalLimiter);

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false },
});
app.use("/api/admin/posts/:id/ai-edit", aiLimiter);

// Request logging
app.use((req, _res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = _res.json.bind(_res);
  _res.json = function (bodyJson: any) {
    capturedJsonResponse = bodyJson;
    return originalResJson(bodyJson);
  } as any;

  _res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${_res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      console.log(logLine);
    }
  });

  next();
});

// Routes
app.use("/api", publicRoutes);
app.use("/api/admin", adminRoutes);

// Error handler
app.use(errorHandler);

// Start
const port = process.env.PORT ? parseInt(process.env.PORT) : 5000;
const server = createServer(app);
server.listen({ port, host: "0.0.0.0" }, () => {
  console.log(`API server running on port ${port}`);
});
