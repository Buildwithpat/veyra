import { GitCompareArrows, Leaf, Search, Shirt } from "lucide-react"

import { VeyraAiIcon } from "@/components/shared/veyra-ai-icon"
import { defaultSuggestedPrompts } from "@/features/assistant/default-prompts"

const PROMPT_ICONS = [Search, Shirt, Leaf, GitCompareArrows]

export function AssistantEmptyState({
  onPromptSelect,
}: {
  onPromptSelect: (prompt: string) => void
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 py-10 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-linear-to-br from-primary/20 to-primary/5 text-primary ring-1 ring-primary/15">
        <VeyraAiIcon className="size-5" />
      </div>
      <div>
        <h3 className="font-medium text-foreground">Ask about any fabric</h3>
        <p className="mt-1 max-w-xs text-sm leading-relaxed text-muted-foreground">
          I can search the marketplace, compare fabrics, explain specs, and help you find the
          right material for your project.
        </p>
      </div>
      <div className="flex w-full flex-col gap-2">
        {defaultSuggestedPrompts.map((prompt, i) => {
          const Icon = PROMPT_ICONS[i % PROMPT_ICONS.length]
          return (
            <button
              key={prompt}
              type="button"
              onClick={() => onPromptSelect(prompt)}
              className="group flex items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-2.5 text-left text-sm text-muted-foreground shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-accent hover:text-foreground hover:shadow-md active:translate-y-0"
            >
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                <Icon className="size-3.5" />
              </span>
              {prompt}
            </button>
          )
        })}
      </div>
    </div>
  )
}
