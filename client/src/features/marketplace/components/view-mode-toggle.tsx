import { LayoutGrid, LayoutList, Rows3 } from "lucide-react"

import type { MarketplaceViewMode } from "@/features/marketplace/components/marketplace-product-card"
import { cn } from "@/lib/utils"

const modes: Array<{ value: MarketplaceViewMode; label: string; icon: typeof LayoutGrid }> = [
  { value: "large", label: "Large cards", icon: LayoutList },
  { value: "compact", label: "Compact grid", icon: LayoutGrid },
  { value: "masonry", label: "Masonry", icon: Rows3 },
]

interface ViewModeToggleProps {
  value: MarketplaceViewMode
  onChange: (mode: MarketplaceViewMode) => void
}

export function ViewModeToggle({ value, onChange }: ViewModeToggleProps) {
  return (
    <div className="border-border/70 bg-card/70 inline-flex items-center gap-0.5 rounded-full border p-1 backdrop-blur-sm">
      {modes.map((mode) => (
        <button
          key={mode.value}
          type="button"
          onClick={() => onChange(mode.value)}
          aria-label={mode.label}
          aria-pressed={value === mode.value}
          className={cn(
            "flex size-7 items-center justify-center rounded-full transition-colors",
            value === mode.value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <mode.icon className="size-3.5" />
        </button>
      ))}
    </div>
  )
}
