import type { CategoryDocument } from "../models/category.model.js"

export function toPublicCategory(category: CategoryDocument) {
  return {
    id: String(category._id),
    slug: category.slug,
    name: category.name,
    description: category.description,
    icon: category.icon,
  }
}
