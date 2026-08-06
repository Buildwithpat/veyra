import type { AiProvider, ChatMessage } from "../types.js"

interface OpenAiCompatibleConfig {
  name: string
  baseUrl: string
  apiKey: string
  model: string
}

/**
 * A single implementation shared by every provider that speaks the OpenAI
 * chat-completions wire format — which today means OpenAI itself, Groq
 * (explicitly OpenAI-SDK-compatible), and Hugging Face's Inference Providers
 * router. Swapping between them is a config change, not a code change.
 */
export function createOpenAiCompatibleProvider(
  config: OpenAiCompatibleConfig,
): AiProvider {
  const endpoint = `${config.baseUrl.replace(/\/$/, "")}/chat/completions`

  async function complete(messages: ChatMessage[]): Promise<string> {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({ model: config.model, messages, temperature: 0.4 }),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => "")
      throw new Error(
        `${config.name} request failed (${res.status}): ${text.slice(0, 200)}`,
      )
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>
    }
    const content = data.choices?.[0]?.message?.content
    if (typeof content !== "string") {
      throw new Error(`${config.name} returned an unexpected response shape`)
    }
    return content
  }

  async function* stream(messages: ChatMessage[]): AsyncIterable<string> {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages,
        temperature: 0.4,
        stream: true,
      }),
    })

    if (!res.ok || !res.body) {
      const text = await res.text().catch(() => "")
      throw new Error(
        `${config.name} stream failed (${res.status}): ${text.slice(0, 200)}`,
      )
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ""

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })

      const lines = buffer.split("\n")
      buffer = lines.pop() ?? ""

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed.startsWith("data:")) continue
        const payload = trimmed.slice(5).trim()
        if (payload === "[DONE]") return

        try {
          const json = JSON.parse(payload)
          const delta = json.choices?.[0]?.delta?.content
          if (typeof delta === "string" && delta.length > 0) yield delta
        } catch {
          // Ignore malformed keep-alive lines rather than failing the stream.
        }
      }
    }
  }

  return { name: config.name, complete, stream }
}
