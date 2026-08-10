import { Schema, model, Types, type Document } from "mongoose"

export type RfqRequestStatus = "open" | "awarded" | "closed"

export const RFQ_REQUEST_STATUSES: RfqRequestStatus[] = ["open", "awarded", "closed"]

export interface RfqRequestDocument extends Document {
  buyer: Types.ObjectId
  categorySlug: string
  title: string
  description: string
  quantity: number
  unit: string
  targetPriceMax?: number
  deadline?: Date
  status: RfqRequestStatus
  awardedResponseId?: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const rfqRequestSchema = new Schema<RfqRequestDocument>(
  {
    buyer: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    // Matches Category._id (a string slug-like id), not an ObjectId ref.
    categorySlug: { type: String, required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, required: true, maxlength: 1000 },
    quantity: { type: Number, required: true, min: 1 },
    unit: { type: String, required: true },
    targetPriceMax: { type: Number, min: 0 },
    deadline: { type: Date },
    status: {
      type: String,
      enum: RFQ_REQUEST_STATUSES,
      default: "open",
    },
    awardedResponseId: { type: Schema.Types.ObjectId, ref: "RfqResponse" },
  },
  { timestamps: true },
)

rfqRequestSchema.index({ categorySlug: 1, status: 1, createdAt: -1 })
rfqRequestSchema.index({ buyer: 1, createdAt: -1 })

export const RfqRequest = model<RfqRequestDocument>("RfqRequest", rfqRequestSchema)
