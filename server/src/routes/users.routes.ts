import { Router } from "express"

import {
  changePassword,
  changePasswordSchema,
  updateMe,
  updateProfileSchema,
} from "../controllers/users.controller.js"
import { requireAuth } from "../middleware/auth.js"
import { validateBody } from "../utils/validate.js"

export const usersRoutes = Router()

usersRoutes.patch("/me", requireAuth, validateBody(updateProfileSchema), updateMe)
usersRoutes.post(
  "/me/password",
  requireAuth,
  validateBody(changePasswordSchema),
  changePassword,
)
