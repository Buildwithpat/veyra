import { useState } from "react"
import { Link } from "react-router-dom"
import { ChevronDown, Layers } from "lucide-react"

import { ProductVisual } from "@/components/shared/product-visual"
import type { Product } from "@/features/marketplace/types"
import { formatPrice } from "@/lib/format"
import { cn } from "@/lib/utils"

export function SourceCards({ products }: { products: Product[] }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-fit items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <Layers className="size-3.5" />
        Sources ({products.length})
        <ChevronDown className={cn("size-3 transition-transform", expanded && "rotate-180")} />
      </button>

      {expanded && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.slug}`}
              className="group flex flex-col gap-1.5 rounded-lg border border-border bg-card p-2 transition-colors hover:border-primary/40"
            >
              <div className="aspect-square overflow-hidden rounded-md">
                <ProductVisual
                  images={product.images}
                  colorHex={product.colorHex}
                  seed={product.id}
                  alt={product.name}
                  className="size-full transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <p className="truncate text-xs font-medium text-foreground">{product.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatPrice(product.pricePerUnit)}/{product.unit}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
