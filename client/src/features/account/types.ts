export interface UpdateProfileInput {
  name?: string
  // buyer fields
  businessType?: string
  industry?: string
  interests?: string[]
  preferredFabrics?: string[]
  budgetRange?: string
  moqPreference?: string
  // supplier fields
  businessName?: string
  description?: string
  phone?: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
  operatingHours?: string
  categories?: string[]
  defaultMoq?: number
  completeOnboarding?: boolean
}

export interface ChangePasswordInput {
  currentPassword: string
  newPassword: string
}
