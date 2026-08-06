import { z } from "zod"

import { ORDER_STATUSES, Order, type OrderItem } from "../models/order.model.js"
import { Product } from "../models/product.model.js"
import { ApiError, sendSuccess } from "../utils/api-response.js"
import { asyncHandler } from "../utils/async-handler.js"

const orderItemSchema = z.object({
  productId: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  fabricType: z.string().min(1),
  color: z.string().min(1),
  colorHex: z.string().min(1),
  supplierId: z.string().min(1),
  supplierName: z.string().min(1),
  pricePerUnit: z.number().positive(),
  unit: z.string().min(1),
  quantity: z.number().int().positive(),
  subtotal: z.number().positive(),
})

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

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, "Cart is empty"),
  shipping: shippingSchema,
})

export const updateOrderStatusSchema = z.object({
  status: z.enum(ORDER_STATUSES as [string, ...string[]]),
})

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

export function toSupplierOrderResponse(
  order: InstanceType<typeof Order>,
  supplierId: string,
) {
  const items = order.items.filter((item: OrderItem) => item.supplierId === supplierId)
  const supplierSubtotal = items.reduce((sum, item) => sum + item.subtotal, 0)

  return {
    id: String(order._id),
    items,
    supplierSubtotal,
    shipping: order.shipping,
    total: order.total,
    status: order.status,
    createdAt: order.createdAt,
  }
}

export const createOrder = asyncHandler(async (req, res) => {
  const { items, shipping } = req.body as z.infer<typeof createOrderSchema>

  // Never trust client-submitted prices — re-derive each line item's price
  // and subtotal from the current Product record so a tampered request body
  // can't check out at an arbitrary price.
  const products = await Product.find({
    _id: { $in: items.map((item) => item.productId) },
    isActive: true,
  })
  const productsById = new Map(products.map((p) => [String(p._id), p]))

  const pricedItems: OrderItem[] = items.map((item) => {
    const product = productsById.get(item.productId)
    if (!product) {
      throw new ApiError(400, `"${item.name}" is no longer available`)
    }
    if (item.quantity < product.moq) {
      throw new ApiError(400, `"${item.name}" requires a minimum order of ${product.moq} ${product.unit}s`)
    }
    return {
      ...item,
      pricePerUnit: product.pricePerUnit,
      subtotal: product.pricePerUnit * item.quantity,
    }
  })

  const subtotal = pricedItems.reduce((sum, item) => sum + item.subtotal, 0)

  const order = await Order.create({
    buyer: req.auth?.sub,
    items: pricedItems,
    shipping,
    subtotal,
    total: subtotal,
  })

  sendSuccess(res, toOrderResponse(order), "Order placed", 201)
})

export const listMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ buyer: req.auth?.sub }).sort({ createdAt: -1 })
  sendSuccess(res, orders.map(toOrderResponse))
})

export const getMyOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, buyer: req.auth?.sub })
  if (!order) {
    throw new ApiError(404, "Order not found")
  }
  sendSuccess(res, toOrderResponse(order))
})

export const listIncomingOrders = asyncHandler(async (req, res) => {
  const supplierId = req.auth!.sub
  const rawLimit = req.query.limit ? Number(req.query.limit) : undefined
  const limit = rawLimit && Number.isFinite(rawLimit) ? Math.min(rawLimit, 100) : undefined

  let query = Order.find({ "items.supplierId": supplierId }).sort({ createdAt: -1 })
  if (limit) query = query.limit(limit)

  const orders = await query
  sendSuccess(
    res,
    orders.map((order) => toSupplierOrderResponse(order, supplierId)),
  )
})

export const getIncomingOrder = asyncHandler(async (req, res) => {
  const supplierId = req.auth!.sub
  const order = await Order.findOne({
    _id: req.params.id,
    "items.supplierId": supplierId,
  })
  if (!order) {
    throw new ApiError(404, "Order not found")
  }
  sendSuccess(res, toSupplierOrderResponse(order, supplierId))
})

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const supplierId = req.auth!.sub
  const { status } = req.body as z.infer<typeof updateOrderStatusSchema>

  const order = await Order.findOne({
    _id: req.params.id,
    "items.supplierId": supplierId,
  })
  if (!order) {
    throw new ApiError(404, "Order not found")
  }

  order.status = status as (typeof ORDER_STATUSES)[number]
  await order.save()

  sendSuccess(res, toSupplierOrderResponse(order, supplierId), "Order status updated")
})
