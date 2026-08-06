export interface ChatMessage {
  role: "system" | "user" | "assistant"
  content: string
}

/** A real LLM backend. The zero-config template fallback is handled
 * separately in assistant-service.ts, not as an implementation of this
 * interface — it doesn't do free-form generation, so forcing it through a
 * chat-completion shape would be a leaky abstraction. */
export interface AiProvider {
  name: string
  complete(messages: ChatMessage[]): Promise<string>
  /** Optional — assistant-service falls back to complete() when absent. */
  stream?(messages: ChatMessage[]): AsyncIterable<string>
}

export type AssistantAction = "search" | "compare" | "explain" | "recommend" | "general"

export interface AssistantIntent {
  action: AssistantAction
  keywords: string[]
  categorySlugs: string[]
  colors: string[]
  priceMax?: number
  moqMax?: number
  availability: Array<"in-stock" | "limited" | "made-to-order">
}

export interface AssistantContext {
  /** Product the user is currently viewing (e.g. asked from a PDP). */
  productSlug?: string
  /** Explicit products to compare, e.g. from a "compare" action on the PDP. */
  compareSlugs?: string[]
}
