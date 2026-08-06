import type { Product } from "@/features/marketplace/types"

export interface AssistantMessage {
  id: string
  role: "user" | "assistant"
  content: string
  sources?: Product[]
  suggestedPrompts?: string[]
  isStreaming?: boolean
  error?: string
}

export interface AssistantContext {
  productSlug?: string
  compareSlugs?: string[]
}

export type AssistantStreamEvent =
  | { type: "chunk"; content: string }
  | { type: "done"; sources: Product[]; suggestedPrompts: string[]; provider: string }
  | { type: "error"; message: string }
