import { Router } from "express"

import {
  getConversation,
  listConversations,
  sendMessage,
  sendMessageSchema,
} from "../controllers/messages.controller.js"
import { requireAuth } from "../middleware/auth.js"
import { validateBody } from "../utils/validate.js"

export const messagesRoutes = Router()

messagesRoutes.post("/", requireAuth, validateBody(sendMessageSchema), sendMessage)
messagesRoutes.get("/conversations", requireAuth, listConversations)
messagesRoutes.get("/conversations/:userId", requireAuth, getConversation)
