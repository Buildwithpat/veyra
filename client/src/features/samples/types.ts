import type { ShippingAddress } from "@/features/orders/types"

export type SampleRequestStatus = "pending" | "approved" | "shipped" | "declined"

export interface SampleRequest {
  id: string
  productId: string
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
  createdAt: string
}

export interface CreateSampleRequestInput {
  productId: string
  note?: string
  shippingAddress: ShippingAddress
}
