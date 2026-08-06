import { env } from "@/config/env"
import type { AssistantContext, AssistantStreamEvent } from "@/features/assistant/types"
import { getAccessToken } from "@/lib/auth-storage"

interface ChatRequestMessage {
  role: "user" | "assistant"
  content: string
}

/**
 * Streams the assistant's response via SSE. Uses native fetch rather than
 * the axios `apiClient` — axios doesn't expose a browser ReadableStream in a
 * way that's worth fighting for a one-off streaming endpoint.
 */
export async function* streamAssistantChat(
  messages: ChatRequestMessage[],
  context: AssistantContext | undefined,
  signal: AbortSignal,
): AsyncGenerator<AssistantStreamEvent> {
  const token = getAccessToken()

  const response = await fetch(`${env.apiUrl}/assistant/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ messages, context }),
    signal,
  })

  if (!response.ok || !response.body) {
    throw new Error(`Assistant request failed (${response.status})`)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ""

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    const blocks = buffer.split("\n\n")
    buffer = blocks.pop() ?? ""

    for (const block of blocks) {
      const line = block.trim()
      if (!line.startsWith("data:")) continue
      const payload = line.slice(5).trim()
      if (!payload) continue

      try {
        yield JSON.parse(payload) as AssistantStreamEvent
      } catch {
        // Ignore malformed frames rather than failing the whole stream.
      }
    }
  }
}
