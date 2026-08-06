import { useEffect, useMemo, useState, type ReactNode } from "react"

import { CartContext } from "@/features/cart/cart-context"
import type { CartItem } from "@/features/cart/types"

const STORAGE_KEY = "veyra_cart"

function readStoredCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CartItem[]) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(readStoredCart)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  function addItem(item: Omit<CartItem, "quantity">, quantity: number) {
    setItems((current) => {
      const existing = current.find((i) => i.productId === item.productId)
      if (existing) {
        return current.map((i) =>
          i.productId === item.productId ? { ...i, quantity: i.quantity + quantity } : i,
        )
      }
      return [...current, { ...item, quantity }]
    })
  }

  function updateQuantity(productId: string, quantity: number) {
    setItems((current) =>
      current.map((i) =>
        i.productId === productId ? { ...i, quantity: Math.max(i.moq, quantity) } : i,
      ),
    )
  }

  function removeItem(productId: string) {
    setItems((current) => current.filter((i) => i.productId !== productId))
  }

  function clear() {
    setItems([])
  }

  // Count line items, not total meters — the badge should read "1 fabric in
  // cart," not "80 meters," which reads like a huge, alarming order.
  const itemCount = useMemo(() => items.length, [items])
  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity * i.pricePerUnit, 0),
    [items],
  )

  return (
    <CartContext.Provider
      value={{ items, itemCount, subtotal, addItem, updateQuantity, removeItem, clear }}
    >
      {children}
    </CartContext.Provider>
  )
}
