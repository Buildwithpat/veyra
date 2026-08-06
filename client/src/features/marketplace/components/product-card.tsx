import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Star } from "lucide-react"

import { AvailabilityBadge } from "@/components/shared/availability-badge"
import { ProductVisual } from "@/components/shared/product-visual"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/features/marketplace/types"
import { formatNumber, formatPrice } from "@/lib/format"

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/products/${product.slug}`} className="group block">
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="border-border bg-card overflow-hidden rounded-xl border"
      >
        <div className="relative aspect-4/5 overflow-hidden">
          <ProductVisual
            images={product.images}
            colorHex={product.colorHex}
            seed={product.id}
            alt={product.name}
            className="absolute inset-0 size-full transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
            {product.featured ? <Badge>Featured</Badge> : <span />}
            <AvailabilityBadge availability={product.availability} />
          </div>
        </div>

        <div className="flex flex-col gap-1 p-4">
          <p className="text-muted-foreground text-xs">
            {product.fabricType} &middot; {product.color}
          </p>
          <h3 className="text-foreground truncate font-medium">{product.name}</h3>
          <p className="text-muted-foreground truncate text-xs">
            {product.supplier.name}
          </p>

          <div className="mt-2 flex items-end justify-between">
            <div>
              <p className="text-foreground font-semibold">
                {formatPrice(product.pricePerUnit)}
                <span className="text-muted-foreground text-xs font-normal">
                  /{product.unit}
                </span>
              </p>
              <p className="text-muted-foreground text-xs">
                MOQ {formatNumber(product.moq)} {product.unit}s
              </p>
            </div>
            <div className="text-muted-foreground flex items-center gap-1 text-xs">
              <Star className="fill-warning text-warning size-3" />
              {product.rating.toFixed(1)}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
