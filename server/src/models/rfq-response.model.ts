import { Schema, model, Types, type Document } from "mongoose"

export type RfqResponseStatus = "submitted" | "accepted" | "rejected" | "withdrawn"

export const RFQ_RESPONSE_STATUSES: RfqResponseStatus[] = [
  "submitted",
  "accepted",
  "rejected",
  "withdrawn",
]

export interface RfqResponseDocument extends Document {
  rfqRequest: Types.ObjectId
  supplier: Types.ObjectId
  supplierName: string
  pricePerUnit: number
  moq: number
  leadTimeDays: number
  note?: string
  status: RfqResponseStatus
  createdAt: Date
  updatedAt: Date
}

const rfqResponseSchema = new Schema<RfqResponseDocument>(
  {
    rfqRequest: {
      type: Schema.Types.ObjectId,
      ref: "RfqRequest",
      required: true,
      index: true,
    },
    supplier: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    supplierName: { type: String, required: true },
    pricePerUnit: { type: Number, required: true, min: 0 },
    moq: { type: Number, required: true, min: 1 },
    leadTimeDays: { type: Number, required: true, min: 0 },
    note: { type: String, maxlength: 500 },
    status: {
      type: String,
      enum: RFQ_RESPONSE_STATUSES,
      default: "submitted",
    },
  },
  { timestamps: true },
)

// A supplier can only have one active response per RFQ — update it instead
// of creating duplicates (see submitResponse's upsert-by-this-key logic).
rfqResponseSchema.index({ rfqRequest: 1, supplier: 1 }, { unique: true })

export const RfqResponse = model<RfqResponseDocument>("RfqResponse", rfqResponseSchema)
