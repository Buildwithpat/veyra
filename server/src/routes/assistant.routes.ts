import { Router } from "express"

import { chat, chatSchema } from "../controllers/assistant.controller.js"
import { optionalAuth } from "../middleware/auth.js"
import { validateBody } from "../utils/validate.js"

export const assistantRoutes = Router()

// Public — the assistant helps buyers discover the marketplace before they
// necessarily have an account, same as browsing the marketplace itself.
// optionalAuth attaches an identity when one is available, needed for the
// subset of messages that ask the assistant to take an action (e.g. sending
// a message to a supplier) on the user's behalf.
assistantRoutes.post("/chat", optionalAuth, validateBody(chatSchema), chat)
