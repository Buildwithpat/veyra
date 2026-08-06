import { createContext } from "react"

import type { CartItem } from "@/features/cart/types"

export interface CartContextValue {
  items: CartItem[]
  itemCount: number
  subtotal: number
  addItem: (item: Omit<CartItem, "quantity">, quantity: number) => void
  updateQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clear: () => void
}

export const CartContext = createContext<CartContextValue | null>(null)
