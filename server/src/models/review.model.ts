import { Schema, model, Types, type Document } from "mongoose"

export interface ReviewDocument extends Document {
  product: Types.ObjectId
  buyer: Types.ObjectId
  buyerName: string
  rating: number
  comment: string
  createdAt: Date
  updatedAt: Date
}

const reviewSchema = new Schema<ReviewDocument>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    buyer: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    buyerName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, minlength: 10, maxlength: 1000 },
  },
  { timestamps: true },
)

// One review per buyer per product — subsequent submissions edit it in place.
reviewSchema.index({ product: 1, buyer: 1 }, { unique: true })

export const Review = model<ReviewDocument>("Review", reviewSchema)
