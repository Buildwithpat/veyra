import type { AiProvider, ChatMessage } from "../types.js"

interface GeminiConfig {
  apiKey: string
  model: string
}

function toGeminiRequest(messages: ChatMessage[]) {
  const systemParts = messages.filter((m) => m.role === "system").map((m) => m.content)
  const contents = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }))

  return {
    contents,
    systemInstruction: systemParts.length
      ? { parts: [{ text: systemParts.join("\n\n") }] }
      : undefined,
  }
}

/** Gemini's REST shape differs enough from OpenAI's (contents/parts, a
 * separate systemInstruction field, no "assistant" role) that it needs its
 * own implementation rather than reusing the OpenAI-compatible one. */
export function createGeminiProvider(config: GeminiConfig): AiProvider {
  const base = `https://generativelanguage.googleapis.com/v1beta/models/${config.model}`

  async function complete(messages: ChatMessage[]): Promise<string> {
    const res = await fetch(`${base}:generateContent?key=${config.apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toGeminiRequest(messages)),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => "")
      throw new Error(`Gemini request failed (${res.status}): ${text.slice(0, 200)}`)
    }

    const data = (await res.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
    }
    const parts = data.candidates?.[0]?.content?.parts
    const content = parts?.map((p) => p.text ?? "").join("")
    if (!content) {
      throw new Error("Gemini returned an unexpected response shape")
    }
    return content
  }

  async function* stream(messages: ChatMessage[]): AsyncIterable<string> {
    const res = await fetch(
      `${base}:streamGenerateContent?alt=sse&key=${config.apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toGeminiRequest(messages)),
      },
    )

    if (!res.ok || !res.body) {
      const text = await res.text().catch(() => "")
      throw new Error(`Gemini stream failed (${res.status}): ${text.slice(0, 200)}`)
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
        if (!payload) continue

        try {
          const json = JSON.parse(payload)
          const parts = json.candidates?.[0]?.content?.parts as
            Array<{ text?: string }> | undefined
          const delta = parts?.map((p) => p.text ?? "").join("") ?? ""
          if (delta) yield delta
        } catch {
          // Ignore malformed keep-alive lines rather than failing the stream.
        }
      }
    }
  }

  return { name: "gemini", complete, stream }
}
