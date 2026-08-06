import { Category } from "../models/category.model.js"
import { sendSuccess } from "../utils/api-response.js"
import { asyncHandler } from "../utils/async-handler.js"
import { toPublicCategory } from "../utils/serialize-category.js"

export const listCategories = asyncHandler(async (_req, res) => {
  const categories = await Category.find().sort({ name: 1 })
  sendSuccess(res, categories.map(toPublicCategory))
})
