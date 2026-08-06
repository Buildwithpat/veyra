export interface OrderItem {
  productId: string
  slug: string
  name: string
  fabricType: string
  color: string
  colorHex: string
  supplierId: string
  supplierName: string
  pricePerUnit: number
  unit: string
  quantity: number
  subtotal: number
}

export interface ShippingAddress {
  fullName: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
}

export type OrderStatus =
  "pending" | "accepted" | "preparing" | "ready-for-dispatch" | "completed"

export interface Order {
  id: string
  items: OrderItem[]
  shipping: ShippingAddress
  subtotal: number
  total: number
  status: OrderStatus
  createdAt: string
}

export interface CreateOrderInput {
  items: OrderItem[]
  shipping: ShippingAddress
}

export interface SupplierOrder {
  id: string
  items: OrderItem[]
  supplierSubtotal: number
  shipping: ShippingAddress
  total: number
  status: OrderStatus
  createdAt: string
}
