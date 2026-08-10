import { Router } from "express"

import {
  acceptResponse,
  acceptResponseSchema,
  createRfq,
  createRfqSchema,
  getMyRfq,
  listMyRfqs,
  listOpenRfqsForSupplier,
  submitResponse,
  submitResponseSchema,
  withdrawResponse,
} from "../controllers/rfq.controller.js"
import { requireAuth, requireRole } from "../middleware/auth.js"
import { validateBody } from "../utils/validate.js"

export const rfqRoutes = Router()

rfqRoutes.post(
  "/",
  requireAuth,
  requireRole("buyer"),
  validateBody(createRfqSchema),
  createRfq,
)
rfqRoutes.get("/mine", requireAuth, requireRole("buyer"), listMyRfqs)
rfqRoutes.get("/mine/:id", requireAuth, requireRole("buyer"), getMyRfq)

rfqRoutes.get("/open", requireAuth, requireRole("supplier"), listOpenRfqsForSupplier)

rfqRoutes.post(
  "/:id/responses",
  requireAuth,
  requireRole("supplier"),
  validateBody(submitResponseSchema),
  submitResponse,
)
rfqRoutes.post(
  "/:id/responses/:responseId/accept",
  requireAuth,
  requireRole("buyer"),
  validateBody(acceptResponseSchema),
  acceptResponse,
)
rfqRoutes.patch(
  "/:id/responses/:responseId/withdraw",
  requireAuth,
  requireRole("supplier"),
  withdrawResponse,
)
