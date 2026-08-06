import type { FilterQuery, SortOrder } from "mongoose"

import { Product, type ProductDocument } from "../../models/product.model.js"
import { toPublicProduct } from "../../utils/serialize-product.js"
import type { AssistantContext, AssistantIntent } from "./types.js"

const RESULT_LIMIT = 6

async function populateAndSerialize(query: ReturnType<typeof Product.find>) {
  const docs = await query.populate("category").populate("supplier")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- populate() widens the doc type beyond what TS can narrow generically here
  return docs.map((doc) => toPublicProduct(doc as any))
}

function buildStructuredFilter(intent: AssistantIntent): FilterQuery<ProductDocument> {
  const filter: FilterQuery<ProductDocument> = { isActive: true }

  if (intent.categorySlugs.length) filter.category = { $in: intent.categorySlugs }
  if (intent.colors.length) {
    filter.color = { $in: intent.colors.map((c) => new RegExp(c, "i")) }
  }
  if (intent.priceMax != null) filter.pricePerUnit = { $lte: intent.priceMax }
  if (intent.moqMax != null) filter.moq = { $lte: intent.moqMax }
  if (intent.availability.length) filter.availability = { $in: intent.availability }

  return filter
}

/**
 * Retrieves the marketplace data the assistant should ground its answer in.
 * Explicit frontend context (viewing/comparing specific products) always
 * takes priority over parsing the message text — it's more reliable than
 * trying to extract product names from free-form language.
 */
export async function retrieveProducts(
  intent: AssistantIntent,
  context?: AssistantContext,
) {
  if (context?.compareSlugs?.length) {
    const products = await populateAndSerialize(
      Product.find({ slug: { $in: context.compareSlugs }, isActive: true }),
    )
    if (products.length > 0) return products
  }

  if (context?.productSlug) {
    const current = await Product.findOne({ slug: context.productSlug, isActive: true })

    if (current) {
      if (intent.action === "explain") {
        return populateAndSerialize(Product.find({ _id: current._id }))
      }

      if (intent.action === "compare") {
        const alternative = await populateAndSerialize(
          Product.find({
            category: current.category,
            _id: { $ne: current._id },
            isActive: true,
          })
            .sort({ rating: -1 })
            .limit(1),
        )
        const currentSerialized = await populateAndSerialize(
          Product.find({ _id: current._id }),
        )
        return [...currentSerialized, ...alternative]
      }

      if (intent.action === "recommend") {
        return populateAndSerialize(
          Product.find({
            category: current.category,
            _id: { $ne: current._id },
            isActive: true,
          })
            .sort({ rating: -1 })
            .limit(RESULT_LIMIT),
        )
      }
    }
  }

  const filter = buildStructuredFilter(intent)
  const hasKeywords = intent.keywords.length > 0
  const sort: Record<string, SortOrder | { $meta: "textScore" }> = hasKeywords
    ? { score: { $meta: "textScore" } }
    : { featured: -1, rating: -1 }

  const query = Product.find(
    hasKeywords ? { ...filter, $text: { $search: intent.keywords.join(" ") } } : filter,
  )
  if (hasKeywords) query.select({ score: { $meta: "textScore" } })
  query.sort(sort).limit(RESULT_LIMIT)

  let products = await populateAndSerialize(query)

  // Text search can legitimately return zero hits on unusual phrasing —
  // fall back to the structured filters alone before giving up.
  if (products.length === 0 && hasKeywords) {
    products = await populateAndSerialize(
      Product.find(filter).sort({ featured: -1, rating: -1 }).limit(RESULT_LIMIT),
    )
  }

  return products
}
