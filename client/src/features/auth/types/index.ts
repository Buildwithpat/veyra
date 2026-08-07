export type UserRole = "buyer" | "supplier"

export interface BuyerProfile {
  businessType?: string
  industry?: string
  interests?: string[]
  preferredFabrics?: string[]
  budgetRange?: string
  moqPreference?: string
}

export interface SupplierProfile {
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
  verified?: boolean
  yearsInBusiness?: number
  responseTime?: string
  certifications?: string[]
  rating?: number
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  onboardingCompleted: boolean
  buyerProfile?: BuyerProfile
  supplierProfile?: SupplierProfile
  createdAt: string
}

export interface AuthResponse {
  user: User
  accessToken: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  name: string
  email: string
  password: string
  role: UserRole
}

export interface ForgotPasswordInput {
  email: string
}

export interface ForgotPasswordResponse {
  otp?: string
  expiresInMinutes?: number
}

export interface ResetPasswordInput {
  otp: string
  newPassword: string
}
