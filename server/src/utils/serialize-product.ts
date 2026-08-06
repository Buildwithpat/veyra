import type { CategoryDocument } from "../models/category.model.js"
import type { ProductDocument } from "../models/product.model.js"
import type { UserDocument } from "../models/user.model.js"
import { toPublicCategory } from "./serialize-category.js"
import { toPublicSupplier } from "./serialize-supplier.js"

type PopulatedProduct = ProductDocument & {
  category: CategoryDocument
  supplier: UserDocument
}

export type PublicProduct = ReturnType<typeof toPublicProduct>

export function toPublicProduct(product: PopulatedProduct) {
  return {
    id: String(product._id),
    slug: product.slug,
    name: product.name,
    category: toPublicCategory(product.category),
    fabricType: product.fabricType,
    color: product.color,
    colorHex: product.colorHex,
    composition: product.composition,
    weightGsm: product.weightGsm,
    widthCm: product.widthCm,
    pricePerUnit: product.pricePerUnit,
    currency: product.currency,
    unit: product.unit,
    moq: product.moq,
    availability: product.availability,
    leadTimeDays: product.leadTimeDays,
    supplier: toPublicSupplier(product.supplier),
    rating: product.rating,
    reviewCount: product.reviewCount,
    description: product.description,
    tags: product.tags,
    images: product.images,
    featured: product.featured,
    isActive: product.isActive,
    createdAt: product.createdAt,
  }
}
