import { useEffect, useState } from "react"
import { Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface QuantityStepperProps {
  value: number
  min: number
  step?: number
  onChange: (value: number) => void
  className?: string
}

export function QuantityStepper({
  value,
  min,
  step = 1,
  onChange,
  className,
}: QuantityStepperProps) {
  // Kept as local text so the buyer can type any exact quantity (e.g. 12,
  // 13) instead of being locked to the +/- step size — only committed back
  // via onChange on blur/Enter, so a mid-typing "1" doesn't get clamped away.
  const [draft, setDraft] = useState(String(value))

  useEffect(() => {
    setDraft(String(value))
  }, [value])

  function commit() {
    const parsed = Math.round(Number(draft))
    onChange(Number.isFinite(parsed) ? Math.max(min, parsed) : min)
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-8"
        onClick={() => onChange(Math.max(min, value - step))}
        disabled={value <= min}
      >
        <Minus className="size-3.5" />
      </Button>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault()
            e.currentTarget.blur()
          }
        }}
        aria-label="Quantity"
        className="border-border bg-background w-16 rounded-md border py-1 text-center text-sm font-medium tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-8"
        onClick={() => onChange(value + step)}
      >
        <Plus className="size-3.5" />
      </Button>
    </div>
  )
}
