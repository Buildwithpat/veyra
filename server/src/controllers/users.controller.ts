import { z } from "zod"

import { User } from "../models/user.model.js"
import { ApiError, sendSuccess } from "../utils/api-response.js"
import { asyncHandler } from "../utils/async-handler.js"
import { strongPassword } from "../utils/password-schema.js"
import { toPublicUser } from "../utils/serialize-user.js"

const buyerFieldKeys = [
  "businessType",
  "industry",
  "interests",
  "preferredFabrics",
  "budgetRange",
  "moqPreference",
] as const

const supplierFieldKeys = [
  "businessName",
  "description",
  "phone",
  "addressLine1",
  "addressLine2",
  "city",
  "state",
  "postalCode",
  "country",
  "operatingHours",
  "categories",
  "defaultMoq",
] as const

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  // buyer fields
  businessType: z.string().min(1).max(100).optional(),
  industry: z.string().min(1).max(100).optional(),
  interests: z.array(z.string()).optional(),
  preferredFabrics: z.array(z.string()).optional(),
  budgetRange: z.string().optional(),
  moqPreference: z.string().optional(),
  // supplier fields
  businessName: z.string().min(1).max(150).optional(),
  description: z.string().max(2000).optional(),
  phone: z.string().min(6).max(30).optional(),
  addressLine1: z.string().min(3).max(200).optional(),
  addressLine2: z.string().max(200).optional(),
  city: z.string().min(1).max(100).optional(),
  state: z.string().min(1).max(100).optional(),
  postalCode: z.string().min(1).max(20).optional(),
  country: z.string().min(1).max(100).optional(),
  operatingHours: z.string().max(200).optional(),
  categories: z.array(z.string()).optional(),
  defaultMoq: z.number().int().positive().optional(),
  completeOnboarding: z.boolean().optional(),
})

function pickDefined<T extends Record<string, unknown>>(
  source: T,
  keys: readonly (keyof T)[],
) {
  const result: Partial<T> = {}
  for (const key of keys) {
    if (source[key] !== undefined) result[key] = source[key]
  }
  return result
}

export const updateMe = asyncHandler(async (req, res) => {
  const { name, completeOnboarding, ...fields } = req.body as z.infer<
    typeof updateProfileSchema
  >

  const user = await User.findById(req.auth?.sub)
  if (!user) {
    throw new ApiError(404, "User not found")
  }

  if (name) user.name = name

  if (user.role === "buyer") {
    const buyerFields = pickDefined(fields, buyerFieldKeys)
    if (Object.keys(buyerFields).length > 0) {
      user.buyerProfile = { ...user.buyerProfile, ...buyerFields }
    }
  } else {
    const supplierFields = pickDefined(fields, supplierFieldKeys)
    if (Object.keys(supplierFields).length > 0) {
      user.supplierProfile = { ...user.supplierProfile, ...supplierFields }
    }
  }

  if (completeOnboarding) user.onboardingCompleted = true

  await user.save()

  sendSuccess(res, toPublicUser(user), "Profile updated")
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Enter your current password"),
  newPassword: strongPassword,
})

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body as z.infer<typeof changePasswordSchema>

  const user = await User.findById(req.auth?.sub).select("+password")
  if (!user) {
    throw new ApiError(404, "User not found")
  }

  if (!(await user.comparePassword(currentPassword))) {
    throw new ApiError(401, "Current password is incorrect")
  }

  user.password = newPassword
  await user.save()

  sendSuccess(res, null, "Password updated")
})
