import { z } from "zod"

import { Order } from "../models/order.model.js"
import { Product } from "../models/product.model.js"
import { Review, type ReviewDocument } from "../models/review.model.js"
import { User } from "../models/user.model.js"
import { getAiProvider } from "../services/ai/providers/index.js"
import type { ChatMessage } from "../services/ai/types.js"
import { ApiError, sendSuccess } from "../utils/api-response.js"
import { asyncHandler } from "../utils/async-handler.js"

export const submitReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(10).max(1000),
})

function toReviewResponse(review: ReviewDocument) {
  return {
    id: String(review._id),
    productId: String(review.product),
    buyerName: review.buyerName,
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt,
  }
}

/** Whether a buyer has a completed order containing this product — the
 * closed-loop gate for leaving (or editing) a review. Exported for reuse. */
export async function canReviewProduct(buyerId: string, productId: string): Promise<boolean> {
  const order = await Order.exists({
    buyer: buyerId,
    status: "completed",
    "items.productId": productId,
  })
  return Boolean(order)
}

/** Recomputes and persists Product.rating/reviewCount from the live set of
 * reviews for that product. Called after every review write. */
export async function recomputeProductRating(productId: string): Promise<void> {
  const reviews = await Review.find({ product: productId })
  const reviewCount = reviews.length
  const rating =
    reviewCount === 0
      ? 0
      : Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount) * 10) / 10

  await Product.findByIdAndUpdate(productId, { rating, reviewCount })
}

export const getReviewEligibility = asyncHandler(async (req, res) => {
  const buyerId = req.auth!.sub
  const productId = req.params.productId as string

  const [canReview, hasReviewed] = await Promise.all([
    canReviewProduct(buyerId, productId),
    Review.exists({ product: productId, buyer: buyerId }).then(Boolean),
  ])

  sendSuccess(res, { canReview, hasReviewed })
})

export const submitReview = asyncHandler(async (req, res) => {
  const buyerId = req.auth!.sub
  const productId = req.params.productId as string
  const { rating, comment } = req.body as z.infer<typeof submitReviewSchema>

  const eligible = await canReviewProduct(buyerId, productId)
  if (!eligible) {
    throw new ApiError(
      403,
      "You can review a fabric after an order containing it is marked completed",
    )
  }

  const buyer = await User.findById(buyerId)
  if (!buyer) {
    throw new ApiError(404, "Buyer not found")
  }

  const review = await Review.findOneAndUpdate(
    { product: productId, buyer: buyerId },
    { product: productId, buyer: buyerId, buyerName: buyer.name, rating, comment },
    { upsert: true, new: true },
  )

  await recomputeProductRating(productId)

  sendSuccess(res, toReviewResponse(review), "Review submitted")
})

export const listProductReviews = asyncHandler(async (req, res) => {
  const productId = req.params.productId as string
  const rawLimit = Number(req.query.limit)
  const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, 100) : 50

  const reviews = await Review.find({ product: productId })
    .sort({ createdAt: -1 })
    .limit(limit)

  sendSuccess(res, reviews.map(toReviewResponse))
})

const summaryCache = new Map<string, { verdict: string; averageRating: number; expiresAt: number }>()
const SUMMARY_CACHE_TTL_MS = 5 * 60 * 1000

function buildDeterministicVerdict(
  reviews: ReviewDocument[],
  averageRating: number,
): string {
  const sorted = [...reviews].sort((a, b) => b.rating - a.rating)
  const highest = sorted[0]
  const lowest = sorted[sorted.length - 1]

  const tierDescription =
    averageRating >= 4.5
      ? "excellent"
      : averageRating >= 3.5
        ? "good"
        : averageRating >= 2.5
          ? "mixed"
          : "poor"

  const parts = [
    `Rated ${averageRating.toFixed(1)}/5 across ${reviews.length} review${reviews.length === 1 ? "" : "s"} — buyers rate this fabric ${tierDescription} overall.`,
  ]

  if (highest) {
    parts.push(`Highest-rated (${highest.rating}/5): "${highest.comment.slice(0, 200)}"`)
  }
  if (lowest && lowest !== highest) {
    parts.push(`Lowest-rated (${lowest.rating}/5): "${lowest.comment.slice(0, 200)}"`)
  }

  return parts.join(" ")
}

export const getReviewSummary = asyncHandler(async (req, res) => {
  const productId = req.params.productId as string

  const reviews = await Review.find({ product: productId }).sort({ createdAt: -1 }).limit(20)

  if (reviews.length === 0) {
    sendSuccess(res, { verdict: null, reviewCount: 0, averageRating: 0 })
    return
  }

  const allReviewCount = await Review.countDocuments({ product: productId })
  const averageRating =
    Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10

  const cacheKey = `${productId}:${allReviewCount}`
  const cached = summaryCache.get(cacheKey)
  if (cached && cached.expiresAt > Date.now()) {
    sendSuccess(res, {
      verdict: cached.verdict,
      reviewCount: allReviewCount,
      averageRating: cached.averageRating,
    })
    return
  }

  let verdict: string | null = null

  const provider = getAiProvider()
  if (provider) {
    try {
      const product = await Product.findById(productId)
      const messages: ChatMessage[] = [
        {
          role: "system",
          content:
            "You are summarizing real buyer reviews of a specific B2B fabric listing for other prospective buyers. Write a short, honest 2-4 sentence verdict that reflects both praise and complaints found in the reviews. Do not fabricate specifics (colors, defects, use-cases) that are not present in the reviews.",
        },
        {
          role: "user",
          content: [
            `Product: ${product?.name ?? "Unknown"} (${product?.fabricType ?? "unknown fabric type"})`,
            "Reviews:",
            ...reviews.map((r) => `- ${r.rating}/5: ${r.comment}`),
          ].join("\n"),
        },
      ]

      verdict = await provider.complete(messages)
    } catch {
      verdict = null
    }
  }

  if (!verdict) {
    verdict = buildDeterministicVerdict(reviews, averageRating)
  }

  summaryCache.set(cacheKey, {
    verdict,
    averageRating,
    expiresAt: Date.now() + SUMMARY_CACHE_TTL_MS,
  })

  sendSuccess(res, { verdict, reviewCount: allReviewCount, averageRating })
})
