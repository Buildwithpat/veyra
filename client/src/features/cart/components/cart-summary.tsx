import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/format"

interface CartSummaryProps {
  subtotal: number
  ctaLabel: string
  onCta: () => void
  ctaDisabled?: boolean
}

export function CartSummary({
  subtotal,
  ctaLabel,
  onCta,
  ctaDisabled,
}: CartSummaryProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Subtotal</span>
        <span className="text-foreground font-semibold">{formatPrice(subtotal)}</span>
      </div>
      <p className="text-muted-foreground text-xs">
        Freight, duties and taxes are calculated at checkout.
      </p>
      <Button size="lg" className="w-full" onClick={onCta} disabled={ctaDisabled}>
        {ctaLabel}
      </Button>
    </div>
  )
}
