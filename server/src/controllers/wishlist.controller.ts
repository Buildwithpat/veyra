import { z } from "zod"

import { Product } from "../models/product.model.js"
import { WishlistItem } from "../models/wishlist.model.js"
import { ApiError, sendSuccess } from "../utils/api-response.js"
import { asyncHandler } from "../utils/async-handler.js"
import { toPublicProduct } from "../utils/serialize-product.js"

export const addToWishlistSchema = z.object({
  productId: z.string().min(1),
})

export const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body as z.infer<typeof addToWishlistSchema>

  const product = await Product.findById(productId)
  if (!product) {
    throw new ApiError(404, "Product not found")
  }

  try {
    const item = await WishlistItem.create({ buyer: req.auth?.sub, product: productId })
    sendSuccess(res, { id: String(item._id) }, "Added to wishlist", 201)
  } catch (err) {
    const mongoErr = err as { code?: number }
    if (mongoErr.code === 11000) {
      sendSuccess(res, { id: productId }, "Already in wishlist")
      return
    }
    throw err
  }
})

export const removeFromWishlist = asyncHandler(async (req, res) => {
  await WishlistItem.deleteOne({ buyer: req.auth?.sub, product: req.params.productId })
  sendSuccess(res, null, "Removed from wishlist")
})

export const listWishlist = asyncHandler(async (req, res) => {
  const items = await WishlistItem.find({ buyer: req.auth?.sub })
    .sort({ createdAt: -1 })
    .populate({ path: "product", populate: ["category", "supplier"] })

  const wishlist = items
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- populate() widens the doc type beyond what TS can narrow generically here
    .filter((item) => (item.product as any)?.isActive)
    .map((item) => ({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- populate() widens the doc type beyond what TS can narrow generically here
      ...toPublicProduct(item.product as any),
      savedAt: item.createdAt,
    }))

  sendSuccess(res, wishlist)
})

export const checkWishlistStatus = asyncHandler(async (req, res) => {
  const raw = typeof req.query.productIds === "string" ? req.query.productIds : ""
  const productIds = raw
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)

  const status: Record<string, boolean> = {}
  for (const id of productIds) status[id] = false

  if (productIds.length > 0) {
    const items = await WishlistItem.find({
      buyer: req.auth?.sub,
      product: { $in: productIds },
    })
    for (const item of items) status[String(item.product)] = true
  }

  sendSuccess(res, status)
})
