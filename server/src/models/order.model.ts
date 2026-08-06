import { Schema, model, Types, type Document } from "mongoose"

export type OrderStatus =
  "pending" | "accepted" | "preparing" | "ready-for-dispatch" | "completed"

export const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "accepted",
  "preparing",
  "ready-for-dispatch",
  "completed",
]

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

export interface OrderDocument extends Document {
  buyer: Types.ObjectId
  items: OrderItem[]
  shipping: ShippingAddress
  subtotal: number
  total: number
  status: OrderStatus
  createdAt: Date
  updatedAt: Date
}

const orderItemSchema = new Schema<OrderItem>(
  {
    productId: { type: String, required: true },
    slug: { type: String, required: true },
    name: { type: String, required: true },
    fabricType: { type: String, required: true },
    color: { type: String, required: true },
    colorHex: { type: String, required: true },
    supplierId: { type: String, required: true, index: true },
    supplierName: { type: String, required: true },
    pricePerUnit: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    subtotal: { type: Number, required: true, min: 0 },
  },
  { _id: false },
)

const shippingAddressSchema = new Schema<ShippingAddress>(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false },
)

const orderSchema = new Schema<OrderDocument>(
  {
    buyer: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: (v: unknown[]) => v.length > 0,
    },
    shipping: { type: shippingAddressSchema, required: true },
    subtotal: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: "pending",
    },
  },
  { timestamps: true },
)

orderSchema.index({ "items.supplierId": 1, createdAt: -1 })

export const Order = model<OrderDocument>("Order", orderSchema)
