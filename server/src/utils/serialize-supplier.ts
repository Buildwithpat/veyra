import type { UserDocument } from "../models/user.model.js"

export function toPublicSupplier(user: UserDocument) {
  const profile = user.supplierProfile

  return {
    id: String(user._id),
    name: profile?.businessName || user.name,
    city: profile?.city ?? "",
    country: profile?.country ?? "",
    verified: profile?.verified ?? false,
    rating: profile?.rating ?? 0,
    yearsInBusiness: profile?.yearsInBusiness ?? 0,
    responseTime: profile?.responseTime ?? "",
    certifications: profile?.certifications ?? [],
  }
}

const PROFILE_COMPLETION_FIELDS = [
  "businessName",
  "phone",
  "addressLine1",
  "city",
  "country",
  "operatingHours",
  "defaultMoq",
] as const

export function computeSupplierProfileCompletion(user: UserDocument) {
  const profile = user.supplierProfile
  if (!profile) return 0

  const filled = PROFILE_COMPLETION_FIELDS.filter(
    (field) => profile[field] != null && profile[field] !== "",
  )
  const hasCategories = (profile.categories?.length ?? 0) > 0

  const total = PROFILE_COMPLETION_FIELDS.length + 1
  const completed = filled.length + (hasCategories ? 1 : 0)

  return Math.round((completed / total) * 100)
}
