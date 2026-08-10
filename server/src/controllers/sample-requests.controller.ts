import { z } from "zod"

import { Product } from "../models/product.model.js"
import {
  SAMPLE_REQUEST_STATUSES,
  SampleRequest,
  type SampleRequestDocument,
} from "../models/sample-request.model.js"
import { User } from "../models/user.model.js"
import { ApiError, sendSuccess } from "../utils/api-response.js"
import { asyncHandler } from "../utils/async-handler.js"
import { toPublicSupplier } from "../utils/serialize-supplier.js"

const shippingAddressSchema = z.object({
  fullName: z.string().min(2).max(120),
  phone: z.string().min(6).max(30),
  addressLine1: z.string().min(3).max(200),
  addressLine2: z.string().max(200).optional(),
  city: z.string().min(1).max(100),
  state: z.string().min(1).max(100),
  postalCode: z.string().min(1).max(20),
  country: z.string().min(1).max(100),
})

export const createSampleRequestSchema = z.object({
  productId: z.string().min(1),
  note: z.string().max(300).optional(),
  shippingAddress: shippingAddressSchema,
})

// Suppliers may only move a request forward through its lifecycle — they
// can't set it back to "pending", and buyers can't set any status at all.
export const updateSampleRequestStatusSchema = z.object({
  status: z.enum(
    SAMPLE_REQUEST_STATUSES.filter((status) => status !== "pending") as [
      string,
      ...string[],
    ],
  ),
})

function toSampleRequestResponse(sampleRequest: SampleRequestDocument) {
  return {
    id: String(sampleRequest._id),
    productId: String(sampleRequest.product),
    productName: sampleRequest.productName,
    productSlug: sampleRequest.productSlug,
    fabricType: sampleRequest.fabricType,
    color: sampleRequest.color,
    colorHex: sampleRequest.colorHex,
    supplierId: sampleRequest.supplierId,
    supplierName: sampleRequest.supplierName,
    note: sampleRequest.note,
    status: sampleRequest.status,
    shippingAddress: sampleRequest.shippingAddress,
    createdAt: sampleRequest.createdAt,
  }
}

export const createSampleRequest = asyncHandler(async (req, res) => {
  const { productId, note, shippingAddress } = req.body as z.infer<
    typeof createSampleRequestSchema
  >

  const product = await Product.findOne({ _id: productId, isActive: true })
  if (!product) {
    throw new ApiError(404, "Product not found")
  }

  const supplierUser = await User.findById(product.supplier)
  if (!supplierUser) {
    throw new ApiError(404, "Supplier not found")
  }
  const supplier = toPublicSupplier(supplierUser)

  const sampleRequest = await SampleRequest.create({
    buyer: req.auth?.sub,
    product: product._id,
    productName: product.name,
    productSlug: product.slug,
    fabricType: product.fabricType,
    color: product.color,
    colorHex: product.colorHex,
    supplierId: supplier.id,
    supplierName: supplier.name,
    note,
    shippingAddress,
  })

  sendSuccess(res, toSampleRequestResponse(sampleRequest), "Sample request sent", 201)
})

export const listMySampleRequests = asyncHandler(async (req, res) => {
  const sampleRequests = await SampleRequest.find({ buyer: req.auth?.sub }).sort({
    createdAt: -1,
  })
  sendSuccess(res, sampleRequests.map(toSampleRequestResponse))
})

export const listIncomingSampleRequests = asyncHandler(async (req, res) => {
  const supplierId = req.auth!.sub
  const status = typeof req.query.status === "string" ? req.query.status : undefined

  const query: Record<string, unknown> = { supplierId }
  if (status) query.status = status

  const sampleRequests = await SampleRequest.find(query).sort({ createdAt: -1 })
  sendSuccess(res, sampleRequests.map(toSampleRequestResponse))
})

export const updateSampleRequestStatus = asyncHandler(async (req, res) => {
  const supplierId = req.auth!.sub
  const { status } = req.body as z.infer<typeof updateSampleRequestStatusSchema>

  const sampleRequest = await SampleRequest.findOne({
    _id: req.params.id,
    supplierId,
  })
  if (!sampleRequest) {
    throw new ApiError(404, "Sample request not found")
  }

  sampleRequest.status = status as SampleRequestDocument["status"]
  await sampleRequest.save()

  sendSuccess(res, toSampleRequestResponse(sampleRequest), "Sample request updated")
})
