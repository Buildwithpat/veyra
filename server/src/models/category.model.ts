import { Schema, model, type Document } from "mongoose"

export interface CategoryDocument extends Document<string> {
  slug: string
  name: string
  description: string
  icon: string
}

const categorySchema = new Schema<CategoryDocument>({
  _id: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
})

export const Category = model<CategoryDocument>("Category", categorySchema)
