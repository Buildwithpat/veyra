import { RotateCcw } from "lucide-react"

import { VeyraAiIcon } from "@/components/shared/veyra-ai-icon"
import { Button } from "@/components/ui/button"
import { AssistantMarkdown } from "@/features/assistant/components/assistant-markdown"
import { AssistantTypingIndicator } from "@/features/assistant/components/assistant-typing-indicator"
import { PromptChips } from "@/features/assistant/components/prompt-chips"
import { SourceCards } from "@/features/assistant/components/source-cards"
import type { AssistantMessage } from "@/features/assistant/types"
import { cn } from "@/lib/utils"

interface MessageBubbleProps {
  message: AssistantMessage
  onPromptSelect: (prompt: string) => void
  onRetry?: () => void
}

export function MessageBubble({ message, onPromptSelect, onRetry }: MessageBubbleProps) {
  if (message.role === "user") {
    return (
      <div className="flex animate-slide-up justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm leading-relaxed text-primary-foreground">
          {message.content}
        </div>
      </div>
    )
  }

  const isThinking = message.isStreaming && message.content.length === 0

  return (
    <div className="flex animate-slide-up gap-3">
      <div
        className={cn(
          "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary/20 to-primary/5 text-primary ring-1 ring-primary/15 transition-shadow",
          message.isStreaming && "animate-pulse shadow-[0_0_0_3px] shadow-primary/10",
        )}
      >
        <VeyraAiIcon className="size-3.5" />
      </div>

      <div className="flex flex-1 flex-col gap-3 pt-0.5">
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
        ) : isThinking ? (
          <AssistantTypingIndicator />
        ) : (
          <div>
            <AssistantMarkdown content={message.content} />
            {message.isStreaming && (
              <span className="ml-0.5 inline-block h-3.5 w-0.75 animate-pulse rounded-full bg-primary/60 align-middle" />
            )}
          </div>
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
