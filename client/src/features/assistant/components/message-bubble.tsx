import { RotateCcw } from "lucide-react"

import { VeyraAiIcon } from "@/components/shared/veyra-ai-icon"
import { Button } from "@/components/ui/button"
import { PromptChips } from "@/features/assistant/components/prompt-chips"
import { SourceCards } from "@/features/assistant/components/source-cards"
import type { AssistantMessage } from "@/features/assistant/types"

interface MessageBubbleProps {
  message: AssistantMessage
  onPromptSelect: (prompt: string) => void
  onRetry?: () => void
}

export function MessageBubble({ message, onPromptSelect, onRetry }: MessageBubbleProps) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-2.5">
      <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <VeyraAiIcon className="size-3.5" />
      </div>

      <div className="flex flex-1 flex-col gap-3">
        {message.error ? (
          <div className="flex flex-col items-start gap-2">
            <p className="text-sm text-destructive">{message.error}</p>
            {onRetry && (
              <Button variant="outline" size="sm" className="h-7 gap-1.5 px-2 text-xs" onClick={onRetry}>
                <RotateCcw className="size-3" />
                Retry
              </Button>
            )}
          </div>
        ) : (
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
            {message.content}
            {message.isStreaming && (
              <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-muted-foreground align-middle" />
            )}
          </p>
        )}

        {message.sources && message.sources.length > 0 && (
          <SourceCards products={message.sources} />
        )}

        {!message.isStreaming && message.suggestedPrompts && message.suggestedPrompts.length > 0 && (
          <PromptChips prompts={message.suggestedPrompts} onSelect={onPromptSelect} />
        )}
      </div>
    </div>
  )
}
