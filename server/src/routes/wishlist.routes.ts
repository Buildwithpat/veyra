import { Router } from "express"

import {
  addToWishlist,
  addToWishlistSchema,
  checkWishlistStatus,
  listWishlist,
  removeFromWishlist,
} from "../controllers/wishlist.controller.js"
import { requireAuth, requireRole } from "../middleware/auth.js"
import { validateBody } from "../utils/validate.js"

export const wishlistRoutes = Router()

wishlistRoutes.get("/status", requireAuth, requireRole("buyer"), checkWishlistStatus)
wishlistRoutes.get("/", requireAuth, requireRole("buyer"), listWishlist)
wishlistRoutes.post(
  "/",
  requireAuth,
  requireRole("buyer"),
  validateBody(addToWishlistSchema),
  addToWishlist,
)
wishlistRoutes.delete("/:productId", requireAuth, requireRole("buyer"), removeFromWishlist)
