/** Shown while the assistant is composing its first token — three soft
 * terracotta dots instead of a generic spinner, so "thinking" reads as
 * part of Veyra's own visual language rather than a raw loading state. */
export function AssistantTypingIndicator() {
  return (
    <div className="flex items-center gap-1 py-1" aria-label="Veyra is thinking">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-1.5 animate-bounce rounded-full bg-primary/50"
          style={{ animationDelay: `${i * 0.12}s`, animationDuration: "0.9s" }}
        />
      ))}
    </div>
  )
}
