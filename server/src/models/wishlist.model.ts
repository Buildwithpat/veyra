import { Schema, model, Types, type Document } from "mongoose"

export interface WishlistItemDocument extends Document {
  buyer: Types.ObjectId
  product: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const wishlistItemSchema = new Schema<WishlistItemDocument>(
  {
    buyer: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  },
  { timestamps: true },
)

wishlistItemSchema.index({ buyer: 1, product: 1 }, { unique: true })

export const WishlistItem = model<WishlistItemDocument>("WishlistItem", wishlistItemSchema)
