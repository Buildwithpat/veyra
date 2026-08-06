import { useEffect, useRef, useState } from "react"

import { VeyraAiIcon } from "@/components/shared/veyra-ai-icon"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { AssistantComposer } from "@/features/assistant/components/assistant-composer"
import { AssistantEmptyState } from "@/features/assistant/components/assistant-empty-state"
import { MessageBubble } from "@/features/assistant/components/message-bubble"
import { useAssistantChat } from "@/features/assistant/hooks/use-assistant-chat"
import type { AssistantSeed } from "@/features/assistant/assistant-context"
import type { AssistantContext } from "@/features/assistant/types"

interface AssistantPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  seed: AssistantSeed | null
  onSeedConsumed: () => void
}

export function AssistantPanel({ open, onOpenChange, seed, onSeedConsumed }: AssistantPanelProps) {
  const { messages, isStreaming, sendMessage, clear } = useAssistantChat()
  const [activeContext, setActiveContext] = useState<AssistantContext | undefined>(undefined)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    // Always resync — opening with no seed (e.g. the floating trigger, or
    // reopening after a seeded conversation) must clear any product context
    // left over from a previous "Ask AI" click, or unrelated questions
    // would silently stay scoped to that old product.
    setActiveContext(seed?.context)
    if (seed?.prompt) sendMessage(seed.prompt, seed.context)
    if (seed) onSeedConsumed()
    // seed is consumed once per open — intentionally not re-running on message/context churn
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, seed])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages])

  function handleSend(text: string) {
    sendMessage(text, activeContext)
  }

  function handleClear() {
    clear()
    setActiveContext(undefined)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border pr-10 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-full bg-linear-to-br from-primary/20 to-primary/5 text-primary ring-1 ring-primary/15">
                <VeyraAiIcon className="size-4" />
              </div>
              <div className="flex flex-col">
                <SheetTitle className="leading-tight">Veyra Assistant</SheetTitle>
                <p className="text-xs text-muted-foreground">Fabric sourcing, on demand</p>
              </div>
            </div>
            {messages.length > 0 && (
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={handleClear}>
                Clear
              </Button>
            )}
          </div>
        </SheetHeader>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-5">
          {messages.length === 0 ? (
            <AssistantEmptyState onPromptSelect={handleSend} />
          ) : (
            <div className="flex flex-col gap-7">
              {messages.map((message, index) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  onPromptSelect={handleSend}
                  onRetry={
                    message.error
                      ? () => handleSend(messages[index - 1]?.content ?? "")
                      : undefined
                  }
                />
              ))}
            </div>
          )}
        </div>

        <AssistantComposer onSend={handleSend} disabled={isStreaming} />
      </SheetContent>
    </Sheet>
  )
}
