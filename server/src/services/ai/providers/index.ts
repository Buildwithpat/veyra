import { env } from "../../../config/env.js"
import type { AiProvider } from "../types.js"
import { createGeminiProvider } from "./gemini.js"
import { createOpenAiCompatibleProvider } from "./openai-compatible.js"

/**
 * Returns the configured LLM provider, or null when none is configured (no
 * AI_PROVIDER set, or its API key is missing). Callers should treat null as
 * "fall back to the deterministic template response" — see
 * assistant-service.ts — not as an error.
 */
export function getAiProvider(): AiProvider | null {
  switch (env.AI_PROVIDER) {
    case "openai":
      return env.OPENAI_API_KEY
        ? createOpenAiCompatibleProvider({
            name: "openai",
            baseUrl: "https://api.openai.com/v1",
            apiKey: env.OPENAI_API_KEY,
            model: env.AI_MODEL || "gpt-4o-mini",
          })
        : null

    case "groq":
      return env.GROQ_API_KEY
        ? createOpenAiCompatibleProvider({
            name: "groq",
            baseUrl: "https://api.groq.com/openai/v1",
            apiKey: env.GROQ_API_KEY,
            model: env.AI_MODEL || "llama-3.3-70b-versatile",
          })
        : null

    case "huggingface":
      return env.HUGGINGFACE_API_KEY
        ? createOpenAiCompatibleProvider({
            name: "huggingface",
            baseUrl: "https://router.huggingface.co/v1",
            apiKey: env.HUGGINGFACE_API_KEY,
            model: env.AI_MODEL || "meta-llama/Llama-3.3-70B-Instruct",
          })
        : null

    case "gemini":
      return env.GEMINI_API_KEY
        ? createGeminiProvider({
            apiKey: env.GEMINI_API_KEY,
            model: env.AI_MODEL || "gemini-1.5-flash",
          })
        : null

    default:
      return null
  }
}
