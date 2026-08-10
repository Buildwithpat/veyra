import type { ShippingAddress } from "@/features/orders/types"

export type RfqStatus = "open" | "awarded" | "closed"
export type RfqResponseStatus = "submitted" | "accepted" | "rejected" | "withdrawn"

export interface RfqRequest {
  id: string
  categorySlug: string
  title: string
  description: string
  quantity: number
  unit: string
  targetPriceMax?: number
  deadline?: string
  status: RfqStatus
  awardedResponseId?: string
  createdAt: string
  /** Present on list-mine responses only. */
  responseCount?: number
}

export interface RfqResponse {
  id: string
  rfqRequestId: string
  supplierId: string
  supplierName: string
  pricePerUnit: number
  moq: number
  leadTimeDays: number
  note?: string
  status: RfqResponseStatus
  createdAt: string
}

export type RfqRequestWithResponses = RfqRequest & { responses: RfqResponse[] }

export type OpenRfqForSupplier = RfqRequest & {
  hasResponded: boolean
  myResponseId?: string
}

export interface CreateRfqInput {
  categorySlug: string
  title: string
  description: string
  quantity: number
  unit: string
  targetPriceMax?: number
  deadline?: string
}

export interface SubmitRfqResponseInput {
  pricePerUnit: number
  moq: number
  leadTimeDays: number
  note?: string
}

export type AcceptRfqResponseInput = ShippingAddress
