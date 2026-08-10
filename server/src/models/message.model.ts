import { Schema, model, Types, type Document } from "mongoose"

export interface MessageDocument extends Document {
  sender: Types.ObjectId
  recipient: Types.ObjectId
  body: string
  productId?: Types.ObjectId
  productName?: string
  productSlug?: string
  read: boolean
  createdAt: Date
  updatedAt: Date
}

const messageSchema = new Schema<MessageDocument>(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    recipient: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    body: { type: String, required: true, trim: true, maxlength: 2000 },
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    productName: String,
    productSlug: String,
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
)

// Covers "thread between two users" and "inbox for this user" lookups from
// either side of the conversation.
messageSchema.index({ sender: 1, recipient: 1, createdAt: -1 })
messageSchema.index({ recipient: 1, sender: 1, createdAt: -1 })

export const Message = model<MessageDocument>("Message", messageSchema)
