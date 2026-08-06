import { Sparkles } from "lucide-react"

export function PromptChips({
  prompts,
  onSelect,
}: {
  prompts: string[]
  onSelect: (prompt: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {prompts.map((prompt) => (
        <button
          key={prompt}
          type="button"
          onClick={() => onSelect(prompt)}
          className="group flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-left text-xs text-muted-foreground shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-accent hover:text-foreground hover:shadow-md active:translate-y-0"
        >
          <Sparkles className="size-3 shrink-0 text-primary/60 transition-colors group-hover:text-primary" />
          {prompt}
        </button>
      ))}
    </div>
  )
}
