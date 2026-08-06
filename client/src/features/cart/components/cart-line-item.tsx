import { Link } from "react-router-dom"
import { X } from "lucide-react"

import { FabricSwatch } from "@/components/shared/fabric-swatch"
import { QuantityStepper } from "@/components/shared/quantity-stepper"
import { Button } from "@/components/ui/button"
import { useCart } from "@/features/cart/hooks/use-cart"
import type { CartItem } from "@/features/cart/types"
import { formatPrice } from "@/lib/format"

export function CartLineItem({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCart()

  return (
    <div className="flex gap-3">
      <Link to={`/products/${item.slug}`} className="shrink-0">
        <div className="border-border size-16 overflow-hidden rounded-lg border">
          <FabricSwatch
            colorHex={item.colorHex}
            seed={item.productId}
            className="size-full"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              to={`/products/${item.slug}`}
              className="text-foreground truncate text-sm font-medium hover:underline"
            >
              {item.name}
            </Link>
            <p className="text-muted-foreground text-xs">
              {item.fabricType} &middot; {item.color}
            </p>
            <p className="text-muted-foreground text-xs">{item.supplierName}</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7 shrink-0"
            onClick={() => removeItem(item.productId)}
          >
            <X className="size-3.5" />
            <span className="sr-only">Remove</span>
          </Button>
        </div>

        <div className="mt-1 flex items-center justify-between">
          <QuantityStepper
            value={item.quantity}
            min={item.moq}
            onChange={(quantity) => updateQuantity(item.productId, quantity)}
          />
          <p className="text-foreground text-sm font-semibold">
            {formatPrice(item.quantity * item.pricePerUnit)}
          </p>
        </div>
      </div>
    </div>
  )
}
