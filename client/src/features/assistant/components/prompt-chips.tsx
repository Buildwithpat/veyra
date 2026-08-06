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
          className="rounded-full border border-border px-3 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:bg-accent hover:text-foreground"
        >
          {prompt}
        </button>
      ))}
    </div>
  )
}
