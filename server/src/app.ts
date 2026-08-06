import compression from "compression"
import cors from "cors"
import express from "express"
import { rateLimit } from "express-rate-limit"
import helmet from "helmet"
import morgan from "morgan"

import { env } from "./config/env.js"
import { errorHandler, notFoundHandler } from "./middleware/error-handler.js"
import { apiRouter } from "./routes/index.js"

export const app = express()

app.use(helmet())
app.use(compression())
app.use(cors({ origin: env.CLIENT_URL, credentials: true }))
app.use(express.json())
app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"))

app.get("/health", (_req, res) => {
  res.json({ success: true, data: { status: "ok" } })
})

// Public, unauthenticated endpoints that are the cheapest to abuse — a tight
// per-IP window keeps password-guessing and AI-cost-running attempts in check
// without affecting normal usage.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
})
const assistantLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
})
app.use("/api/auth/login", authLimiter)
app.use("/api/auth/register", authLimiter)
app.use("/api/assistant/chat", assistantLimiter)

app.use("/api", apiRouter)

app.use(notFoundHandler)
app.use(errorHandler)
