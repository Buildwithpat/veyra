import { useState, type FormEvent } from "react"
import { ArrowUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AssistantComposerProps {
  onSend: (text: string) => void
  disabled: boolean
}

export function AssistantComposer({ onSend, disabled }: AssistantComposerProps) {
  const [value, setValue] = useState("")

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue("")
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-border bg-card px-4 py-3">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ask about fabrics, pricing, MOQ..."
        disabled={disabled}
        className="flex-1 rounded-full bg-background"
        aria-label="Message the assistant"
      />
      <Button
        type="submit"
        size="icon"
        className="shrink-0 rounded-full"
        disabled={disabled || !value.trim()}
      >
        <ArrowUp className="size-4" />
        <span className="sr-only">Send</span>
      </Button>
    </form>
  )
}
