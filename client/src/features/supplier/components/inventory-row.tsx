import { Link } from "react-router-dom"
import { Pencil, Trash2 } from "lucide-react"

import { AvailabilityBadge } from "@/components/shared/availability-badge"
import { ProductVisual } from "@/components/shared/product-visual"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import type { Product } from "@/features/marketplace/types"
import { formatPrice } from "@/lib/format"

interface InventoryRowProps {
  product: Product
  onToggleActive: (product: Product) => void
  onDelete: (product: Product) => void
}

export function InventoryRow({ product, onToggleActive, onDelete }: InventoryRowProps) {
  return (
    <div className="border-border bg-card flex items-center gap-4 rounded-xl border p-4">
      <div className="border-border size-14 shrink-0 overflow-hidden rounded-lg border">
        <ProductVisual
          images={product.images}
          colorHex={product.colorHex}
          seed={product.id}
          alt={product.name}
          className="size-full"
        />
      </div>

      <div className="min-w-0 flex-1">
        <Link
          to={`/supplier/inventory/${product.id}/edit`}
          className="text-foreground truncate text-sm font-medium hover:underline"
        >
          {product.name}
        </Link>
        <p className="text-muted-foreground truncate text-xs">
          {product.category.name} &middot; {product.fabricType}
        </p>
      </div>

      <div className="text-foreground hidden w-24 shrink-0 text-right text-sm sm:block">
        {formatPrice(product.pricePerUnit)}/{product.unit}
      </div>

      <div className="hidden shrink-0 md:block">
        <AvailabilityBadge availability={product.availability} />
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Switch
          checked={product.isActive}
          onCheckedChange={() => onToggleActive(product)}
          aria-label={product.isActive ? "Deactivate listing" : "Activate listing"}
        />
        <span className="text-muted-foreground hidden text-xs lg:inline">
          {product.isActive ? "Active" : "Hidden"}
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <Button asChild variant="ghost" size="icon">
          <Link to={`/supplier/inventory/${product.id}/edit`}>
            <Pencil className="size-4" />
            <span className="sr-only">Edit</span>
          </Link>
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onDelete(product)}>
          <Trash2 className="size-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>
    </div>
  )
}
