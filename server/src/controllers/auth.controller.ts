import crypto from "node:crypto"

import { z } from "zod"

import { env } from "../config/env.js"
import { User } from "../models/user.model.js"
import { ApiError, sendSuccess } from "../utils/api-response.js"
import { asyncHandler } from "../utils/async-handler.js"
import { signAccessToken } from "../utils/jwt.js"
import { strongPassword } from "../utils/password-schema.js"
import { toPublicUser } from "../utils/serialize-user.js"

const RESET_TOKEN_TTL_MS = 10 * 60 * 1000

function hashResetToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex")
}

function generateOtp() {
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, "0")
}

export const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: strongPassword,
  role: z.enum(["buyer", "supplier"]),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body as z.infer<typeof registerSchema>

  const existing = await User.findOne({ email })
  if (existing) {
    throw new ApiError(409, "An account with this email already exists")
  }

  const user = await User.create({ name, email, password, role })
  const accessToken = signAccessToken({
    sub: String(user._id),
    role: user.role,
  })

  sendSuccess(res, { user: toPublicUser(user), accessToken }, "Account created", 201)
})

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body as z.infer<typeof loginSchema>

  const user = await User.findOne({ email }).select("+password")
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password")
  }

  const accessToken = signAccessToken({
    sub: String(user._id),
    role: user.role,
  })

  sendSuccess(res, { user: toPublicUser(user), accessToken }, "Signed in")
})

export const logout = asyncHandler(async (_req, res) => {
  sendSuccess(res, null, "Signed out")
})

export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.auth?.sub)
  if (!user) {
    throw new ApiError(404, "User not found")
  }

  sendSuccess(res, toPublicUser(user))
})

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
})

/**
 * No email/SMS provider is wired up (no SMTP/Resend/Twilio/etc.), so this
 * is explicitly a dev-only convenience: the OTP is returned directly in
 * the response (and logged) instead of being sent out-of-band. Never
 * expose it in production — there it just logs server-side, which is a
 * no-op without a way to deliver it, but it also never leaks the code
 * over the API.
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body as z.infer<typeof forgotPasswordSchema>

  const user = await User.findOne({ email })
  if (!user) {
    throw new ApiError(404, "No account found with that email")
  }

  const otp = generateOtp()
  user.resetPasswordTokenHash = hashResetToken(otp)
  user.resetPasswordExpires = new Date(Date.now() + RESET_TOKEN_TTL_MS)
  await user.save()

  console.log(`[dev] Password reset OTP for ${email}: ${otp}`)

  sendSuccess(
    res,
    env.NODE_ENV === "production" ? null : { otp, expiresInMinutes: RESET_TOKEN_TTL_MS / 60_000 },
    "Verification code generated",
  )
})

export const resetPasswordSchema = z.object({
  otp: z.string().length(6),
  newPassword: strongPassword,
})

export const resetPassword = asyncHandler(async (req, res) => {
  const { otp, newPassword } = req.body as z.infer<typeof resetPasswordSchema>

  const user = await User.findOne({
    resetPasswordTokenHash: hashResetToken(otp),
    resetPasswordExpires: { $gt: new Date() },
  }).select("+resetPasswordTokenHash +resetPasswordExpires")

  if (!user) {
    throw new ApiError(400, "Code is invalid or has expired")
  }

  user.password = newPassword
  user.resetPasswordTokenHash = undefined
  user.resetPasswordExpires = undefined
  await user.save()

  sendSuccess(res, null, "Password updated")
})
