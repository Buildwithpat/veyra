import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ShoppingCart } from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { CartLineItem } from "@/features/cart/components/cart-line-item"
import { CartSummary } from "@/features/cart/components/cart-summary"
import { useCart } from "@/features/cart/hooks/use-cart"

export function CartDrawer() {
  const { items, subtotal, itemCount } = useCart()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="size-5" />
          {itemCount > 0 && (
            <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full text-[10px] font-medium">
              {itemCount > 99 ? "99+" : itemCount}
            </span>
          )}
          <span className="sr-only">Open cart</span>
        </Button>
      </SheetTrigger>

      <SheetContent className="flex flex-col gap-0">
        <SheetHeader>
          <SheetTitle>Your cart</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <EmptyState
              icon={ShoppingCart}
              title="Your cart is empty"
              description="Browse the marketplace to add fabrics."
            />
          ) : (
            <div className="flex flex-col gap-5">
              {items.map((item) => (
                <CartLineItem key={item.productId} item={item} />
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-border flex flex-col gap-2 border-t px-6 py-5">
            <CartSummary
              subtotal={subtotal}
              ctaLabel="Checkout"
              onCta={() => {
                setOpen(false)
                navigate("/checkout")
              }}
            />
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => {
                setOpen(false)
                navigate("/cart")
              }}
            >
              View full cart
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
