import { useContext } from "react"

import { AssistantPanelContext } from "@/features/assistant/assistant-context"

export function useAssistantPanel() {
  const context = useContext(AssistantPanelContext)
  if (!context) throw new Error("useAssistantPanel must be used within AssistantProvider")
  return context
}
