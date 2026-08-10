import { z } from "zod"

import { Category } from "../models/category.model.js"
import { Order } from "../models/order.model.js"
import { Product } from "../models/product.model.js"
import {
  RfqRequest,
  type RfqRequestDocument,
} from "../models/rfq-request.model.js"
import {
  RfqResponse,
  type RfqResponseDocument,
} from "../models/rfq-response.model.js"
import { User } from "../models/user.model.js"
import { ApiError, sendSuccess } from "../utils/api-response.js"
import { asyncHandler } from "../utils/async-handler.js"

const shippingSchema = z.object({
  fullName: z.string().min(2).max(120),
  phone: z.string().min(6).max(30),
  addressLine1: z.string().min(3).max(200),
  addressLine2: z.string().max(200).optional(),
  city: z.string().min(1).max(100),
  state: z.string().min(1).max(100),
  postalCode: z.string().min(1).max(20),
  country: z.string().min(1).max(100),
})

export const createRfqSchema = z.object({
  categorySlug: z.string().min(1),
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(1000),
  quantity: z.number().positive(),
  unit: z.string().min(1),
  targetPriceMax: z.number().positive().optional(),
  deadline: z.coerce.date().optional(),
})

export const submitResponseSchema = z.object({
  pricePerUnit: z.number().positive(),
  moq: z.number().int().positive(),
  leadTimeDays: z.number().int().nonnegative(),
  note: z.string().max(500).optional(),
})

export const acceptResponseSchema = z.object({
  shipping: shippingSchema,
})

function toRfqRequestResponse(rfq: RfqRequestDocument) {
  return {
    id: String(rfq._id),
    categorySlug: rfq.categorySlug,
    title: rfq.title,
    description: rfq.description,
    quantity: rfq.quantity,
    unit: rfq.unit,
    targetPriceMax: rfq.targetPriceMax,
    deadline: rfq.deadline,
    status: rfq.status,
    awardedResponseId: rfq.awardedResponseId ? String(rfq.awardedResponseId) : undefined,
    createdAt: rfq.createdAt,
  }
}

function toRfqResponseResponse(response: RfqResponseDocument) {
  return {
    id: String(response._id),
    rfqRequestId: String(response.rfqRequest),
    supplierId: String(response.supplier),
    supplierName: response.supplierName,
    pricePerUnit: response.pricePerUnit,
    moq: response.moq,
    leadTimeDays: response.leadTimeDays,
    note: response.note,
    status: response.status,
    createdAt: response.createdAt,
  }
}

function toOrderResponse(order: InstanceType<typeof Order>) {
  return {
    id: String(order._id),
    items: order.items,
    shipping: order.shipping,
    subtotal: order.subtotal,
    total: order.total,
    status: order.status,
    createdAt: order.createdAt,
  }
}

export const createRfq = asyncHandler(async (req, res) => {
  const { categorySlug, title, description, quantity, unit, targetPriceMax, deadline } =
    req.body as z.infer<typeof createRfqSchema>

  const category = await Category.findById(categorySlug)
  if (!category) {
    throw new ApiError(404, "Category not found")
  }

  const rfq = await RfqRequest.create({
    buyer: req.auth?.sub,
    categorySlug,
    title,
    description,
    quantity,
    unit,
    targetPriceMax,
    deadline,
  })

  sendSuccess(res, toRfqRequestResponse(rfq), "RFQ posted", 201)
})

export const listMyRfqs = asyncHandler(async (req, res) => {
  const rfqs = await RfqRequest.find({ buyer: req.auth?.sub }).sort({ createdAt: -1 })

  const counts = await RfqResponse.aggregate<{ _id: unknown; count: number }>([
    { $match: { rfqRequest: { $in: rfqs.map((rfq) => rfq._id) } } },
    { $group: { _id: "$rfqRequest", count: { $sum: 1 } } },
  ])
  const countByRfq = new Map(counts.map((c) => [String(c._id), c.count]))

  sendSuccess(
    res,
    rfqs.map((rfq) => ({
      ...toRfqRequestResponse(rfq),
      responseCount: countByRfq.get(String(rfq._id)) ?? 0,
    })),
  )
})

export const getMyRfq = asyncHandler(async (req, res) => {
  const rfq = await RfqRequest.findOne({ _id: req.params.id, buyer: req.auth?.sub })
  if (!rfq) {
    throw new ApiError(404, "RFQ not found")
  }

  const responses = await RfqResponse.find({ rfqRequest: rfq._id }).sort({
    pricePerUnit: 1,
  })

  sendSuccess(res, {
    ...toRfqRequestResponse(rfq),
    responses: responses.map(toRfqResponseResponse),
  })
})

export const listOpenRfqsForSupplier = asyncHandler(async (req, res) => {
  const supplierId = req.auth!.sub

  const categories = await Product.distinct("category", {
    supplier: supplierId,
    isActive: true,
  })
  if (categories.length === 0) {
    sendSuccess(res, [])
    return
  }

  const rfqs = await RfqRequest.find({
    status: "open",
    categorySlug: { $in: categories },
  }).sort({ createdAt: -1 })

  // Withdrawn responses don't count as "already responded" — a supplier who
  // withdrew should see the RFQ as open to quote on again.
  const myResponses = await RfqResponse.find({
    rfqRequest: { $in: rfqs.map((rfq) => rfq._id) },
    supplier: supplierId,
    status: { $ne: "withdrawn" },
  })
  const myResponseByRfq = new Map(myResponses.map((r) => [String(r.rfqRequest), r]))

  sendSuccess(
    res,
    rfqs.map((rfq) => {
      const mine = myResponseByRfq.get(String(rfq._id))
      return {
        ...toRfqRequestResponse(rfq),
        hasResponded: Boolean(mine),
        myResponseId: mine ? String(mine._id) : undefined,
      }
    }),
  )
})

export const submitResponse = asyncHandler(async (req, res) => {
  const supplierId = req.auth!.sub
  const { pricePerUnit, moq, leadTimeDays, note } = req.body as z.infer<
    typeof submitResponseSchema
  >

  const rfq = await RfqRequest.findById(req.params.id)
  if (!rfq) {
    throw new ApiError(404, "RFQ not found")
  }
  if (rfq.status !== "open") {
    throw new ApiError(400, "This RFQ is no longer open")
  }

  const supplierUser = await User.findById(supplierId)
  if (!supplierUser) {
    throw new ApiError(404, "Supplier not found")
  }
  // Same name precedence as toPublicSupplier: business name first, else account name.
  const supplierName = supplierUser.supplierProfile?.businessName || supplierUser.name

  const response = await RfqResponse.findOneAndUpdate(
    { rfqRequest: rfq._id, supplier: supplierId },
    {
      rfqRequest: rfq._id,
      supplier: supplierId,
      supplierName,
      pricePerUnit,
      moq,
      leadTimeDays,
      note,
      status: "submitted",
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  )

  sendSuccess(res, toRfqResponseResponse(response), "Quote submitted", 201)
})

export const acceptResponse = asyncHandler(async (req, res) => {
  const buyerId = req.auth!.sub
  const { shipping } = req.body as z.infer<typeof acceptResponseSchema>

  const rfq = await RfqRequest.findOne({ _id: req.params.id, buyer: buyerId })
  if (!rfq) {
    throw new ApiError(404, "RFQ not found")
  }
  if (rfq.status !== "open") {
    throw new ApiError(400, "This RFQ is no longer open")
  }

  const response = await RfqResponse.findOne({
    _id: req.params.responseId,
    rfqRequest: rfq._id,
  })
  if (!response) {
    throw new ApiError(404, "Quote not found")
  }

  // Unlike createOrder, we don't re-derive pricing from a live Product record
  // here: an RFQ response isn't tied to a single listing, and pricePerUnit/moq
  // are the supplier's own submitted quote (not a price the buyer supplied),
  // so there's no tampering risk to guard against by re-deriving from a source
  // of truth — the response itself already IS the source of truth.
  const quantity = rfq.quantity
  const subtotal = response.pricePerUnit * quantity

  const order = await Order.create({
    buyer: buyerId,
    items: [
      {
        productId: `rfq:${rfq._id}`,
        slug: `rfq-${rfq._id}`,
        name: rfq.title,
        fabricType: rfq.title,
        color: "Custom",
        colorHex: "#8a7458",
        supplierId: String(response.supplier),
        supplierName: response.supplierName,
        pricePerUnit: response.pricePerUnit,
        unit: rfq.unit,
        quantity,
        subtotal,
      },
    ],
    shipping,
    subtotal,
    total: subtotal,
  })

  response.status = "accepted"
  await response.save()

  await RfqResponse.updateMany(
    { rfqRequest: rfq._id, _id: { $ne: response._id } },
    { status: "rejected" },
  )

  rfq.status = "awarded"
  rfq.awardedResponseId = response._id
  await rfq.save()

  sendSuccess(res, toOrderResponse(order), "Quote accepted, order created", 201)
})

export const withdrawResponse = asyncHandler(async (req, res) => {
  const supplierId = req.auth!.sub

  const response = await RfqResponse.findOne({
    _id: req.params.responseId,
    rfqRequest: req.params.id,
    supplier: supplierId,
  })
  if (!response) {
    throw new ApiError(404, "Quote not found")
  }

  response.status = "withdrawn"
  await response.save()

  sendSuccess(res, toRfqResponseResponse(response), "Quote withdrawn")
})
