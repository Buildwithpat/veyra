import { Router } from "express"

import { chat, chatSchema } from "../controllers/assistant.controller.js"
import { validateBody } from "../utils/validate.js"

export const assistantRoutes = Router()

// Public — the assistant helps buyers discover the marketplace before they
// necessarily have an account, same as browsing the marketplace itself.
assistantRoutes.post("/chat", validateBody(chatSchema), chat)
