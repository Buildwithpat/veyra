import { Router } from "express"

import {
  forgotPassword,
  forgotPasswordSchema,
  login,
  loginSchema,
  logout,
  me,
  register,
  registerSchema,
  resetPassword,
  resetPasswordSchema,
} from "../controllers/auth.controller.js"
import { requireAuth } from "../middleware/auth.js"
import { validateBody } from "../utils/validate.js"

export const authRoutes = Router()

authRoutes.post("/register", validateBody(registerSchema), register)
authRoutes.post("/login", validateBody(loginSchema), login)
authRoutes.post("/logout", logout)
authRoutes.get("/me", requireAuth, me)
authRoutes.post("/forgot-password", validateBody(forgotPasswordSchema), forgotPassword)
authRoutes.post("/reset-password", validateBody(resetPasswordSchema), resetPassword)
