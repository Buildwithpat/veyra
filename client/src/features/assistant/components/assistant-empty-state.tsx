import { VeyraAiIcon } from "@/components/shared/veyra-ai-icon"
import { defaultSuggestedPrompts } from "@/features/assistant/default-prompts"

export function AssistantEmptyState({
  onPromptSelect,
}: {
  onPromptSelect: (prompt: string) => void
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 py-10 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <VeyraAiIcon className="size-5" />
      </div>
      <div>
        <h3 className="font-medium text-foreground">Ask about any fabric</h3>
        <p className="mt-1 max-w-xs text-sm text-muted-foreground">
          I can search the marketplace, compare fabrics, explain specs, and help you find the
          right material for your project.
        </p>
      </div>
      <div className="flex w-full flex-col gap-2">
        {defaultSuggestedPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => onPromptSelect(prompt)}
            className="rounded-lg border border-border px-3 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:bg-accent hover:text-foreground"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  )
}
