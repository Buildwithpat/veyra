import { Router } from "express"

import {
  getReviewEligibility,
  getReviewSummary,
  listProductReviews,
  submitReview,
  submitReviewSchema,
} from "../controllers/reviews.controller.js"
import { requireAuth, requireRole } from "../middleware/auth.js"
import { validateBody } from "../utils/validate.js"

export const reviewsRoutes = Router()

reviewsRoutes.get(
  "/product/:productId/eligibility",
  requireAuth,
  requireRole("buyer"),
  getReviewEligibility,
)
reviewsRoutes.get("/product/:productId/summary", getReviewSummary)
reviewsRoutes.get("/product/:productId", listProductReviews)
reviewsRoutes.post(
  "/product/:productId",
  requireAuth,
  requireRole("buyer"),
  validateBody(submitReviewSchema),
  submitReview,
)
