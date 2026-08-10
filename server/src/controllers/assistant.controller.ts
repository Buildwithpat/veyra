import { z } from "zod"

import { runAssistantStream } from "../services/ai/assistant-service.js"
import type { ChatMessage } from "../services/ai/types.js"
import { ApiError } from "../utils/api-response.js"
import { asyncHandler } from "../utils/async-handler.js"

export const chatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(2000),
      }),
    )
    .min(1)
    .max(20),
  context: z
    .object({
      productSlug: z.string().optional(),
      compareSlugs: z.array(z.string()).max(4).optional(),
    })
    .optional(),
})

export const chat = asyncHandler(async (req, res) => {
  const { messages, context } = req.body as z.infer<typeof chatSchema>

  const question = messages[messages.length - 1]
  if (question.role !== "user") {
    throw new ApiError(400, "The last message must be from the user")
  }

  const history: ChatMessage[] = messages.slice(0, -1)

  res.setHeader("Content-Type", "text/event-stream")
  res.setHeader("Cache-Control", "no-cache, no-transform")
  res.setHeader("Connection", "keep-alive")
  res.flushHeaders()

  try {
    for await (const event of runAssistantStream(
      history,
      question.content,
      context,
      req.auth?.sub,
    )) {
      res.write(`data: ${JSON.stringify(event)}\n\n`)
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "The assistant is temporarily unavailable."
    res.write(`data: ${JSON.stringify({ type: "error", message })}\n\n`)
  } finally {
    res.end()
  }
})
