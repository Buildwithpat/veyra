import { Link } from "react-router-dom"
import { Star } from "lucide-react"
import { toast } from "sonner"

import { AvailabilityBadge } from "@/components/shared/availability-badge"
import { VeyraAiIcon } from "@/components/shared/veyra-ai-icon"
import { WeaveTexture, inferWeaveKind } from "@/components/shared/weave-texture"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAssistantPanel } from "@/features/assistant/hooks/use-assistant-panel"
import { useCart } from "@/features/cart/hooks/use-cart"
import type { Product } from "@/features/marketplace/types"
import { countryFlag } from "@/lib/country-flags"
import { formatNumber, formatPrice } from "@/lib/format"
import { computeMatchScore } from "@/lib/match-score"

interface ProductPreviewDialogProps {
  product: Product | null
  onOpenChange: (open: boolean) => void
}

/** A quick-view without leaving the grid — the full PDP is still one click away. */
export function ProductPreviewDialog({ product, onOpenChange }: ProductPreviewDialogProps) {
  const { addItem } = useCart()
  const { openAssistant } = useAssistantPanel()

  if (!product) return null

  const matchScore = computeMatchScore(product)

  function handleAddToCart() {
    if (!product) return
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        fabricType: product.fabricType,
        color: product.color,
        colorHex: product.colorHex,
        supplierId: product.supplier.id,
        supplierName: product.supplier.name,
        pricePerUnit: product.pricePerUnit,
        unit: product.unit,
        moq: product.moq,
      },
      product.moq,
    )
    toast.success(`Added ${formatNumber(product.moq)} ${product.unit}s to cart`)
  }

  function handleAskAi() {
    if (!product) return
    openAssistant({
      prompt: `Explain why ${product.name} is suitable for my use case`,
      context: { productSlug: product.slug },
    })
  }

  return (
    <Dialog open={!!product} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="border-border relative aspect-square overflow-hidden rounded-xl border">
            <WeaveTexture
              kind={inferWeaveKind(product.fabricType, product.tags)}
              colorHex={product.colorHex}
              seed={product.id}
            />
            <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
              <AvailabilityBadge availability={product.availability} />
              <span className="bg-primary/90 flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold text-white">
                <VeyraAiIcon className="size-3" />
                {matchScore}%
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <p className="text-foreground text-xl font-semibold">
                {formatPrice(product.pricePerUnit, product.currency)}
                <span className="text-muted-foreground text-sm font-normal">
                  /{product.unit}
                </span>
              </p>
              <p className="text-muted-foreground text-sm">
                MOQ {formatNumber(product.moq)} {product.unit}s
              </p>
            </div>

            <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
              <div>
                <dt className="text-muted-foreground text-xs">Composition</dt>
                <dd className="text-foreground">{product.composition}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">Weight</dt>
                <dd className="text-foreground">{product.weightGsm} gsm</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">Width</dt>
                <dd className="text-foreground">{product.widthCm} cm</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">Lead time</dt>
                <dd className="text-foreground">{product.leadTimeDays} days</dd>
              </div>
            </dl>

            <div className="border-border/70 bg-surface flex items-center justify-between gap-2 rounded-lg border p-2.5">
              <div>
                <p className="text-foreground text-sm font-medium">{product.supplier.name}</p>
                <p className="text-muted-foreground text-xs">
                  {countryFlag(product.supplier.country)} {product.supplier.country}
                </p>
              </div>
              <div className="text-muted-foreground flex items-center gap-1 text-xs">
                <Star className="fill-warning text-warning size-3" />
                {product.rating.toFixed(1)}
              </div>
            </div>

            <div className="mt-auto flex flex-col gap-2 pt-2">
              <Button onClick={handleAddToCart} className="w-full">
                Add {formatNumber(product.moq)} {product.unit}s to cart
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 gap-1.5" onClick={handleAskAi}>
                  <VeyraAiIcon className="size-3.5" />
                  Ask AI
                </Button>
                <Button variant="outline" className="flex-1" asChild>
                  <Link to={`/products/${product.slug}`}>View full page</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
