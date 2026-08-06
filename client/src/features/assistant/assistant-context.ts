import { createContext } from "react"

import type { AssistantContext as AssistantChatContext } from "@/features/assistant/types"

export interface AssistantSeed {
  prompt?: string
  context?: AssistantChatContext
}

export interface AssistantPanelContextValue {
  isOpen: boolean
  openAssistant: (seed?: AssistantSeed) => void
  closeAssistant: () => void
}

export const AssistantPanelContext = createContext<AssistantPanelContextValue | null>(null)
