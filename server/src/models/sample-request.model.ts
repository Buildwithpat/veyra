import { Schema, model, Types, type Document } from "mongoose"

import type { ShippingAddress } from "./order.model.js"

export type SampleRequestStatus = "pending" | "approved" | "shipped" | "declined"

export const SAMPLE_REQUEST_STATUSES: SampleRequestStatus[] = [
  "pending",
  "approved",
  "shipped",
  "declined",
]

export interface SampleRequestDocument extends Document {
  buyer: Types.ObjectId
  product: Types.ObjectId
  productName: string
  productSlug: string
  fabricType: string
  color: string
  colorHex: string
  supplierId: string
  supplierName: string
  note?: string
  status: SampleRequestStatus
  shippingAddress: ShippingAddress
  createdAt: Date
  updatedAt: Date
}

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

const sampleRequestSchema = new Schema<SampleRequestDocument>(
  {
    buyer: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    productName: { type: String, required: true },
    productSlug: { type: String, required: true },
    fabricType: { type: String, required: true },
    color: { type: String, required: true },
    colorHex: { type: String, required: true },
    supplierId: { type: String, required: true, index: true },
    supplierName: { type: String, required: true },
    note: { type: String, maxlength: 300 },
    status: {
      type: String,
      enum: SAMPLE_REQUEST_STATUSES,
      default: "pending",
    },
    shippingAddress: { type: shippingAddressSchema, required: true },
  },
  { timestamps: true },
)

sampleRequestSchema.index({ supplierId: 1, createdAt: -1 })
sampleRequestSchema.index({ buyer: 1, createdAt: -1 })

export const SampleRequest = model<SampleRequestDocument>(
  "SampleRequest",
  sampleRequestSchema,
)
