import { useState } from "react"
import { ShoppingCart } from "lucide-react"
import { toast } from "sonner"

import { AvailabilityBadge } from "@/components/shared/availability-badge"
import { QuantityStepper } from "@/components/shared/quantity-stepper"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/features/cart/hooks/use-cart"
import { LandedCostEstimator } from "@/features/marketplace/components/landed-cost-estimator"
import type { Product } from "@/features/marketplace/types"
import { ContactSupplierButton } from "@/features/messaging/components/contact-supplier-button"
import { RequestSampleButton } from "@/features/samples/components/request-sample-button"
import { WishlistButton } from "@/features/wishlist/components/wishlist-button"
import { formatNumber, formatPrice } from "@/lib/format"

export function BuyPanel({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(product.moq)
  const { addItem } = useCart()

  const subtotal = quantity * product.pricePerUnit

  function handleAddToCart() {
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
      quantity,
    )
    toast.success(`Added ${formatNumber(quantity)} ${product.unit}s to cart`)
  }

  return (
    <Card className="lg:sticky lg:top-24">
      <CardContent className="flex flex-col gap-5 pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-foreground text-2xl font-semibold">
              {formatPrice(product.pricePerUnit)}
              <span className="text-muted-foreground text-sm font-normal">
                /{product.unit}
              </span>
            </p>
            <p className="text-muted-foreground mt-1 text-sm">
              MOQ {formatNumber(product.moq)} {product.unit}s
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <AvailabilityBadge availability={product.availability} />
            <WishlistButton productId={product.id} />
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <p className="text-foreground text-sm font-medium">
            Quantity ({product.unit}s)
          </p>
          <QuantityStepper value={quantity} min={product.moq} onChange={setQuantity} />
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Estimated subtotal</span>
          <span className="text-foreground font-semibold">{formatPrice(subtotal)}</span>
        </div>

        <LandedCostEstimator product={product} quantity={quantity} />

        <Button size="lg" className="w-full gap-2" onClick={handleAddToCart}>
          <ShoppingCart className="size-4" />
          Add to cart
        </Button>
        <ContactSupplierButton
          supplierId={product.supplier.id}
          supplierName={product.supplier.name}
          productId={product.id}
          productName={product.name}
        />
        <RequestSampleButton product={product} />

        <p className="text-muted-foreground text-center text-xs">
          Ships in {product.leadTimeDays} days &middot; Prices exclude freight and duties
        </p>
      </CardContent>
    </Card>
  )
}
