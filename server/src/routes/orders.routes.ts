import { Router } from "express"

import {
  createOrder,
  createOrderSchema,
  getIncomingOrder,
  getMyOrder,
  listIncomingOrders,
  listMyOrders,
  updateOrderStatus,
  updateOrderStatusSchema,
} from "../controllers/orders.controller.js"
import { requireAuth, requireRole } from "../middleware/auth.js"
import { validateBody } from "../utils/validate.js"

export const ordersRoutes = Router()

ordersRoutes.post(
  "/",
  requireAuth,
  requireRole("buyer"),
  validateBody(createOrderSchema),
  createOrder,
)
ordersRoutes.get("/", requireAuth, requireRole("buyer"), listMyOrders)

ordersRoutes.get("/incoming", requireAuth, requireRole("supplier"), listIncomingOrders)
ordersRoutes.get("/incoming/:id", requireAuth, requireRole("supplier"), getIncomingOrder)
ordersRoutes.patch(
  "/:id/status",
  requireAuth,
  requireRole("supplier"),
  validateBody(updateOrderStatusSchema),
  updateOrderStatus,
)

ordersRoutes.get("/:id", requireAuth, requireRole("buyer"), getMyOrder)
