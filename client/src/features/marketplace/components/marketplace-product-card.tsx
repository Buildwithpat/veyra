import { useRef } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Eye, GitCompare, ShoppingCart, Star } from "lucide-react"
import { toast } from "sonner"

import { AvailabilityBadge } from "@/components/shared/availability-badge"
import { VeyraAiIcon } from "@/components/shared/veyra-ai-icon"
import { WeaveTexture, inferWeaveKind } from "@/components/shared/weave-texture"
import { Badge } from "@/components/ui/badge"
import { useAssistantPanel } from "@/features/assistant/hooks/use-assistant-panel"
import { useCart } from "@/features/cart/hooks/use-cart"
import type { Product } from "@/features/marketplace/types"
import { WishlistButton } from "@/features/wishlist/components/wishlist-button"
import { countryFlag } from "@/lib/country-flags"
import { formatNumber, formatPrice } from "@/lib/format"
import { computeMatchScore } from "@/lib/match-score"

export type MarketplaceViewMode = "large" | "compact" | "masonry"

interface MarketplaceProductCardProps {
  product: Product
  viewMode: MarketplaceViewMode
  compareChecked: boolean
  onToggleCompare: () => void
  onPreview: () => void
  className?: string
}

export function MarketplaceProductCard({
  product,
  viewMode,
  compareChecked,
  onToggleCompare,
  onPreview,
  className,
}: MarketplaceProductCardProps) {
  const { addItem } = useCart()
  const { openAssistant } = useAssistantPanel()
  const tileRef = useRef<HTMLDivElement>(null)

  const weaveKind = inferWeaveKind(product.fabricType, product.tags)
  const matchScore = computeMatchScore(product)
  const compact = viewMode === "compact"

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const bounds = tileRef.current?.getBoundingClientRect()
    if (!bounds) return
    const px = ((e.clientX - bounds.left) / bounds.width) * 100
    const py = ((e.clientY - bounds.top) / bounds.height) * 100
    tileRef.current?.style.setProperty("--lx", `${px}%`)
    tileRef.current?.style.setProperty("--ly", `${py}%`)
  }

  function stop(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
  }

  function handleAddToCart(e: React.MouseEvent) {
    stop(e)
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

  function handleAskAi(e: React.MouseEvent) {
    stop(e)
    openAssistant({
      prompt: `Explain why ${product.name} is suitable for my use case`,
      context: { productSlug: product.slug },
    })
  }

  function handlePreview(e: React.MouseEvent) {
    stop(e)
    onPreview()
  }

  function handleCompare(e: React.MouseEvent) {
    stop(e)
    onToggleCompare()
  }

  return (
    <motion.div layout className={className}>
      <Link to={`/products/${product.slug}`} className="group block">
        <motion.div
          whileHover={{ y: -8 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="border-border/70 relative overflow-hidden rounded-2xl border shadow-[0_16px_36px_-18px_rgba(35,22,10,0.28)]"
        >
          <div
            ref={tileRef}
            onMouseMove={handleMouseMove}
            className={`relative overflow-hidden ${compact ? "aspect-square" : "aspect-4/5"}`}
          >
            <WeaveTexture kind={weaveKind} colorHex={product.colorHex} seed={product.id} />

            {/* Light that follows the cursor across the fibers */}
            <div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(220px circle at var(--lx, 50%) var(--ly, 50%), rgba(255,255,255,0.3), transparent 60%)",
              }}
            />

            <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
              <div className="flex flex-col gap-1.5">
                {product.featured && <Badge>Featured</Badge>}
                <AvailabilityBadge availability={product.availability} />
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="bg-primary/90 flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold text-white">
                    <VeyraAiIcon className="size-3" />
                    {matchScore}%
                  </span>
                  <WishlistButton productId={product.id} />
                </div>
                {/* Compact mode hides the hover quick-actions entirely (no
                    room, no hover on touch) — compare still needs a way in,
                    so it gets its own always-visible toggle here. */}
                {compact && (
                  <button
                    type="button"
                    onClick={handleCompare}
                    aria-label={compareChecked ? "Remove from comparison" : "Add to comparison"}
                    className={`flex size-6 items-center justify-center rounded-full shadow-sm backdrop-blur-sm transition-colors ${
                      compareChecked
                        ? "bg-primary text-primary-foreground"
                        : "bg-card/90 text-foreground hover:bg-card"
                    }`}
                  >
                    <GitCompare className="size-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Quick actions — revealed on hover, compact mode skips them */}
            {!compact && (
              <div className="absolute top-1/2 right-3 flex -translate-y-1/2 flex-col gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={handlePreview}
                  aria-label="Quick preview"
                  className="bg-card/90 text-foreground hover:bg-card flex size-8 items-center justify-center rounded-full shadow-sm backdrop-blur-sm transition-colors"
                >
                  <Eye className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={handleCompare}
                  aria-label={compareChecked ? "Remove from comparison" : "Add to comparison"}
                  className={`flex size-8 items-center justify-center rounded-full shadow-sm backdrop-blur-sm transition-colors ${
                    compareChecked
                      ? "bg-primary text-primary-foreground"
                      : "bg-card/90 text-foreground hover:bg-card"
                  }`}
                >
                  <GitCompare className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={handleAskAi}
                  aria-label="Ask Veyra AI about this fabric"
                  className="bg-card/90 text-foreground hover:bg-card flex size-8 items-center justify-center rounded-full shadow-sm backdrop-blur-sm transition-colors"
                >
                  <VeyraAiIcon className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  aria-label="Add to cart"
                  className="bg-card/90 text-foreground hover:bg-card flex size-8 items-center justify-center rounded-full shadow-sm backdrop-blur-sm transition-colors"
                >
                  <ShoppingCart className="size-4" />
                </button>
              </div>
            )}

            {/* White text over an arbitrary swatch color — a token color
                can't guarantee contrast here, so this is a deliberate exception. */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent p-3 pt-10">
              <p className="truncate text-sm font-semibold text-white">{product.name}</p>
              <p className="truncate text-[11px] text-white/75">
                {product.fabricType} · {product.color}
              </p>
              {!compact && (
                <div className="mt-1.5 grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10px] text-white/0 transition-colors duration-200 group-hover:text-white/80">
                  <span>{product.weightGsm} gsm</span>
                  <span>{product.widthCm} cm wide</span>
                  <span>
                    MOQ {formatNumber(product.moq)} {product.unit}s
                  </span>
                  <span>
                    {countryFlag(product.supplier.country)} {product.supplier.country}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-card flex items-center justify-between gap-2 px-3.5 py-3">
            <div>
              <p className="text-foreground text-sm font-semibold">
                {formatPrice(product.pricePerUnit, product.currency)}
                <span className="text-muted-foreground text-xs font-normal">
                  /{product.unit}
                </span>
              </p>
              <p className="text-muted-foreground truncate text-xs">{product.supplier.name}</p>
            </div>
            <div className="text-muted-foreground flex shrink-0 items-center gap-1 text-xs">
              <Star className="fill-warning text-warning size-3" />
              {product.rating.toFixed(1)}
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}
