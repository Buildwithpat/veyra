import { Router } from "express"

import { getDashboardStats } from "../controllers/suppliers.controller.js"
import { requireAuth, requireRole } from "../middleware/auth.js"

export const suppliersRoutes = Router()

suppliersRoutes.get("/me/stats", requireAuth, requireRole("supplier"), getDashboardStats)
