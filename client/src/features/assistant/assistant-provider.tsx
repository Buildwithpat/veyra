import { useCallback, useState, type ReactNode } from "react"

import { AssistantPanelContext, type AssistantSeed } from "@/features/assistant/assistant-context"
import { AssistantPanel } from "@/features/assistant/components/assistant-panel"

export function AssistantProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [seed, setSeed] = useState<AssistantSeed | null>(null)

  const openAssistant = useCallback((next?: AssistantSeed) => {
    setSeed(next ?? null)
    setIsOpen(true)
  }, [])

  const closeAssistant = useCallback(() => setIsOpen(false), [])

  return (
    <AssistantPanelContext.Provider value={{ isOpen, openAssistant, closeAssistant }}>
      {children}
      <AssistantPanel
        open={isOpen}
        onOpenChange={setIsOpen}
        seed={seed}
        onSeedConsumed={() => setSeed(null)}
      />
    </AssistantPanelContext.Provider>
  )
}
