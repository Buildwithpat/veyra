import { Router } from "express"

import {
  createSampleRequest,
  createSampleRequestSchema,
  listIncomingSampleRequests,
  listMySampleRequests,
  updateSampleRequestStatus,
  updateSampleRequestStatusSchema,
} from "../controllers/sample-requests.controller.js"
import { requireAuth, requireRole } from "../middleware/auth.js"
import { validateBody } from "../utils/validate.js"

export const sampleRequestsRoutes = Router()

sampleRequestsRoutes.post(
  "/",
  requireAuth,
  requireRole("buyer"),
  validateBody(createSampleRequestSchema),
  createSampleRequest,
)
sampleRequestsRoutes.get("/", requireAuth, requireRole("buyer"), listMySampleRequests)

sampleRequestsRoutes.get(
  "/incoming",
  requireAuth,
  requireRole("supplier"),
  listIncomingSampleRequests,
)
sampleRequestsRoutes.patch(
  "/:id/status",
  requireAuth,
  requireRole("supplier"),
  validateBody(updateSampleRequestStatusSchema),
  updateSampleRequestStatus,
)
