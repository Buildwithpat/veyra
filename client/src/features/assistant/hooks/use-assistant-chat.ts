import { useCallback, useRef, useState } from "react"

import { streamAssistantChat } from "@/features/assistant/api/assistant-api"
import type { AssistantContext, AssistantMessage } from "@/features/assistant/types"

function createId() {
  return Math.random().toString(36).slice(2)
}

export function useAssistantChat() {
  const [messages, setMessages] = useState<AssistantMessage[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const messagesRef = useRef<AssistantMessage[]>([])
  const abortRef = useRef<AbortController | null>(null)
  messagesRef.current = messages

  const sendMessage = useCallback(async (content: string, context?: AssistantContext) => {
    const trimmed = content.trim()
    if (!trimmed) return

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    const history = messagesRef.current
      .filter((m) => !m.error)
      .map((m) => ({ role: m.role, content: m.content }))

    const assistantId = createId()

    setMessages((prev) => [
      ...prev,
      { id: createId(), role: "user", content: trimmed },
      { id: assistantId, role: "assistant", content: "", isStreaming: true },
    ])
    setIsStreaming(true)

    function updateAssistant(patch: Partial<AssistantMessage>) {
      setMessages((prev) =>
        prev.map((m) => (m.id === assistantId ? { ...m, ...patch } : m)),
      )
    }

    try {
      for await (const event of streamAssistantChat(
        [...history, { role: "user", content: trimmed }],
        context,
        controller.signal,
      )) {
        if (event.type === "chunk") {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: m.content + event.content } : m,
            ),
          )
        } else if (event.type === "done") {
          updateAssistant({
            sources: event.sources,
            suggestedPrompts: event.suggestedPrompts,
            isStreaming: false,
          })
        } else if (event.type === "error") {
          updateAssistant({ error: event.message, isStreaming: false })
        }
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return
      updateAssistant({
        error: "Something went wrong reaching the assistant. Try again.",
        isStreaming: false,
      })
    } finally {
      setIsStreaming(false)
    }
  }, [])

  const clear = useCallback(() => {
    abortRef.current?.abort()
    setMessages([])
  }, [])

  return { messages, isStreaming, sendMessage, clear }
}
