import { Link } from "react-router-dom"
import { motion } from "framer-motion"

import { inferWeaveKind, WeaveTexture } from "@/components/shared/weave-texture"
import type { Product } from "@/features/marketplace/types"
import { countryFlag } from "@/lib/country-flags"
import { formatPrice } from "@/lib/format"

export function MarketplacePreviewCard({ product }: { product: Product }) {
  const weaveKind = inferWeaveKind(product.fabricType, product.tags)
  const isRealListing = !product.id.startsWith("fallback-")

  const card = (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="border-border bg-card group overflow-hidden rounded-2xl border"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <WeaveTexture kind={weaveKind} colorHex={product.colorHex} seed={product.id} />
      </div>

      <div className="flex flex-col gap-2.5 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-foreground truncate text-sm font-semibold">{product.name}</p>
            <p className="text-muted-foreground truncate text-xs">
              {product.fabricType} · {product.color}
            </p>
          </div>
          <span className="text-lg leading-none" title={product.supplier.country}>
            {countryFlag(product.supplier.country)}
          </span>
        </div>

        <p className="text-muted-foreground truncate text-xs">{product.supplier.name}</p>

        <p className="text-foreground font-semibold">
          {formatPrice(product.pricePerUnit, product.currency)}
          <span className="text-muted-foreground text-xs font-normal">/{product.unit}</span>
        </p>
      </div>
    </motion.div>
  )

  if (!isRealListing) return card

  return (
    <Link to={`/products/${product.slug}`} className="block">
      {card}
    </Link>
  )
}
