import { Schema, model, type Document } from "mongoose"
import bcrypt from "bcryptjs"

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

export interface UserDocument extends Document {
  name: string
  email: string
  password: string
  role: "buyer" | "supplier"
  onboardingCompleted: boolean
  buyerProfile?: BuyerProfile
  supplierProfile?: SupplierProfile
  resetPasswordTokenHash?: string
  resetPasswordExpires?: Date
  createdAt: Date
  updatedAt: Date
  comparePassword(candidate: string): Promise<boolean>
}

const buyerProfileSchema = new Schema<BuyerProfile>(
  {
    businessType: String,
    industry: String,
    interests: [String],
    preferredFabrics: [String],
    budgetRange: String,
    moqPreference: String,
  },
  { _id: false },
)

const supplierProfileSchema = new Schema<SupplierProfile>(
  {
    businessName: String,
    description: String,
    phone: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    operatingHours: String,
    categories: [String],
    defaultMoq: Number,
    verified: { type: Boolean, default: false },
    yearsInBusiness: Number,
    responseTime: String,
    certifications: [String],
    rating: { type: Number, min: 0, max: 5, default: 0 },
  },
  { _id: false },
)

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["buyer", "supplier"], required: true },
    onboardingCompleted: { type: Boolean, default: false },
    buyerProfile: { type: buyerProfileSchema, default: undefined },
    supplierProfile: { type: supplierProfileSchema, default: undefined },
    resetPasswordTokenHash: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
  },
  { timestamps: true },
)

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

userSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password)
}

export const User = model<UserDocument>("User", userSchema)
