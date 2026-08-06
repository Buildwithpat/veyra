import { Schema, model, Types, type Document } from "mongoose"

export type Availability = "in-stock" | "limited" | "made-to-order"

export interface ProductDocument extends Document {
  name: string
  slug: string
  category: string
  fabricType: string
  color: string
  colorHex: string
  composition: string
  weightGsm: number
  widthCm: number
  pricePerUnit: number
  currency: string
  unit: "meter" | "yard" | "kg"
  moq: number
  availability: Availability
  leadTimeDays: number
  supplier: Types.ObjectId
  rating: number
  reviewCount: number
  description: string
  tags: string[]
  images: string[]
  featured: boolean
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const productSchema = new Schema<ProductDocument>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, ref: "Category", required: true },
    fabricType: { type: String, required: true },
    color: { type: String, required: true },
    colorHex: { type: String, required: true },
    composition: { type: String, required: true },
    weightGsm: { type: Number, required: true, min: 0 },
    widthCm: { type: Number, required: true, min: 0 },
    pricePerUnit: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: "USD" },
    unit: { type: String, enum: ["meter", "yard", "kg"], required: true },
    moq: { type: Number, required: true, min: 1 },
    availability: {
      type: String,
      enum: ["in-stock", "limited", "made-to-order"],
      required: true,
    },
    leadTimeDays: { type: Number, required: true, min: 0 },
    supplier: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 0, max: 5, default: 0 },
    reviewCount: { type: Number, required: true, min: 0, default: 0 },
    description: { type: String, required: true },
    tags: { type: [String], default: [] },
    images: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

productSchema.index({
  name: "text",
  description: "text",
  fabricType: "text",
  tags: "text",
})
productSchema.index({ category: 1 })
productSchema.index({ supplier: 1 })
productSchema.index({ availability: 1 })
productSchema.index({ pricePerUnit: 1 })
productSchema.index({ moq: 1 })
productSchema.index({ rating: -1 })
productSchema.index({ createdAt: -1 })
productSchema.index({ featured: 1 })
productSchema.index({ isActive: 1 })

export const Product = model<ProductDocument>("Product", productSchema)
