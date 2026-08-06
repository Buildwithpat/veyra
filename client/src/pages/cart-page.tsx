import { useNavigate } from "react-router-dom"
import { ShoppingCart } from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { CartLineItem } from "@/features/cart/components/cart-line-item"
import { CartSummary } from "@/features/cart/components/cart-summary"
import { useCart } from "@/features/cart/hooks/use-cart"
import { useDocumentTitle } from "@/hooks/use-document-title"

export function CartPage() {
  useDocumentTitle("Cart")
  const { items, subtotal, clear } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20">
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          description="Browse the marketplace to find fabrics for your next order."
          actionLabel="Browse marketplace"
          onAction={() => navigate("/marketplace")}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Your cart</h1>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          {items.map((item) => (
            <CartLineItem key={item.productId} item={item} />
          ))}
          <Separator />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-muted-foreground w-fit"
            onClick={clear}
          >
            Clear cart
          </Button>
        </div>

        <Card className="h-fit lg:sticky lg:top-24">
          <CardContent className="pt-6">
            <CartSummary
              subtotal={subtotal}
              ctaLabel="Proceed to checkout"
              onCta={() => navigate("/checkout")}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
