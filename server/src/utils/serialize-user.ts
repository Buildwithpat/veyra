import type { UserDocument } from "../models/user.model.js"

export function toPublicUser(user: UserDocument) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    onboardingCompleted: user.onboardingCompleted,
    buyerProfile: user.buyerProfile,
    supplierProfile: user.supplierProfile,
    createdAt: user.createdAt,
  }
}
