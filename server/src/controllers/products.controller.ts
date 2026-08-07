import type { Request } from "express"
import type { FilterQuery, SortOrder } from "mongoose"
import { z } from "zod"

import { cloudinary } from "../config/cloudinary.js"
import { Category } from "../models/category.model.js"
import { Product, type ProductDocument } from "../models/product.model.js"
import { ApiError, sendSuccess } from "../utils/api-response.js"
import { asyncHandler } from "../utils/async-handler.js"
import { toPublicProduct } from "../utils/serialize-product.js"

const PAGE_SIZE = 12

function toArray(value: unknown): string[] {
  if (value == null) return []
  return Array.isArray(value) ? value.map(String) : [String(value)]
}

function toNumber(value: unknown): number | undefined {
  if (value == null || value === "") return undefined
  const num = Number(value)
  return Number.isFinite(num) ? num : undefined
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

async function generateUniqueSlug(name: string) {
  const base = slugify(name)
  let slug = base
  let suffix = 1

  while (await Product.exists({ slug })) {
    suffix += 1
    slug = `${base}-${suffix}`
  }

  return slug
}

function buildFilter(req: Request): FilterQuery<ProductDocument> {
  const filter: FilterQuery<ProductDocument> = { isActive: true }

  const q = typeof req.query.q === "string" ? req.query.q.trim() : ""
  if (q) filter.$text = { $search: q }

  const categories = toArray(req.query.category)
  if (categories.length) filter.category = { $in: categories }

  const colors = toArray(req.query.color)
  if (colors.length) filter.color = { $in: colors }

  const priceMin = toNumber(req.query.priceMin)
  const priceMax = toNumber(req.query.priceMax)
  if (priceMin != null || priceMax != null) {
    filter.pricePerUnit = {
      ...(priceMin != null && { $gte: priceMin }),
      ...(priceMax != null && { $lte: priceMax }),
    }
  }

  const moqMax = toNumber(req.query.moqMax)
  if (moqMax != null) filter.moq = { $lte: moqMax }

  const availability = toArray(req.query.availability)
  if (availability.length) filter.availability = { $in: availability }

  return filter
}

function buildSort(
  sort: unknown,
  hasTextSearch: boolean,
): Record<string, SortOrder | { $meta: "textScore" }> {
  // Every branch ends with `_id: 1` as a tiebreaker. Without one, ties on
  // the primary key (e.g. two products with the same rating) leave Mongo
  // free to order them differently between the skip/limit calls for page 0
  // and page 1 — so a tied product can land on both pages and appear twice
  // in the infinite-scrolled list, duplicating it (and anything derived
  // from it, like compare selection) on the client.
  switch (sort) {
    case "price-asc":
      return { pricePerUnit: 1, _id: 1 }
    case "price-desc":
      return { pricePerUnit: -1, _id: 1 }
    case "newest":
      return { createdAt: -1, _id: 1 }
    case "rating":
      return { rating: -1, _id: 1 }
    case "relevance":
    default:
      return hasTextSearch
        ? { score: { $meta: "textScore" }, _id: 1 }
        : { featured: -1, rating: -1, _id: 1 }
  }
}

export const listProducts = asyncHandler(async (req, res) => {
  const filter = buildFilter(req)
  const page = Math.max(0, toNumber(req.query.page) ?? 0)
  const hasTextSearch = Boolean(filter.$text)
  const sort = buildSort(req.query.sort, hasTextSearch)

  const query = Product.find(filter)
  if (hasTextSearch) {
    query.select({ score: { $meta: "textScore" } })
  }
  query
    .sort(sort)
    .skip(page * PAGE_SIZE)
    .limit(PAGE_SIZE)
    .populate("category")
    .populate("supplier")

  const [items, total] = await Promise.all([query, Product.countDocuments(filter)])

  sendSuccess(res, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- populate() widens the doc type beyond what TS can narrow generically here
    items: items.map((p) => toPublicProduct(p as any)),
    nextPage: (page + 1) * PAGE_SIZE < total ? page + 1 : null,
    total,
  })
})

export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true })
    .populate("category")
    .populate("supplier")

  if (!product) {
    throw new ApiError(404, "Product not found")
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sendSuccess(res, toPublicProduct(product as any))
})

export const getSimilarProducts = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })
  if (!product) {
    throw new ApiError(404, "Product not found")
  }

  const limit = Math.min(toNumber(req.query.limit) ?? 4, 20)

  const similar = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
    isActive: true,
  })
    .sort({ rating: -1 })
    .limit(limit)
    .populate("category")
    .populate("supplier")

  sendSuccess(
    res,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    similar.map((p) => toPublicProduct(p as any)),
  )
})

export const getProductFilterOptions = asyncHandler(async (_req, res) => {
  const [priceAgg, moqAgg, colors] = await Promise.all([
    Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          min: { $min: "$pricePerUnit" },
          max: { $max: "$pricePerUnit" },
        },
      },
    ]),
    Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, min: { $min: "$moq" }, max: { $max: "$moq" } } },
    ]),
    Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$color", hex: { $first: "$colorHex" } } },
      { $project: { _id: 0, name: "$_id", hex: 1 } },
      { $sort: { name: 1 } },
    ]),
  ])

  sendSuccess(res, {
    colors,
    priceBounds: {
      min: Math.floor(priceAgg[0]?.min ?? 0),
      max: Math.ceil(priceAgg[0]?.max ?? 100),
    },
    moqBounds: {
      min: moqAgg[0]?.min ?? 0,
      max: moqAgg[0]?.max ?? 1000,
    },
  })
})

export const addProductImage = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) {
    throw new ApiError(404, "Product not found")
  }

  if (String(product.supplier) !== req.auth?.sub) {
    throw new ApiError(403, "You do not own this product")
  }

  if (!req.file) {
    throw new ApiError(400, "No image file provided")
  }

  const url = await new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "veyra/products",
        transformation: [{ width: 1600, crop: "limit", quality: "auto", fetch_format: "auto" }],
      },
      (error, result) => {
        if (error || !result) return reject(error ?? new Error("Upload failed"))
        resolve(result.secure_url)
      },
    )
    stream.end(req.file!.buffer)
  })

  product.images.push(url)
  await product.save()
  await product.populate(["category", "supplier"])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sendSuccess(res, toPublicProduct(product as any), "Image uploaded", 201)
})

export const removeProductImageSchema = z.object({
  url: z.string().url(),
})

export const removeProductImage = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) {
    throw new ApiError(404, "Product not found")
  }

  if (String(product.supplier) !== req.auth?.sub) {
    throw new ApiError(403, "You do not own this product")
  }

  const { url } = req.body as z.infer<typeof removeProductImageSchema>
  product.images = product.images.filter((img) => img !== url)
  await product.save()
  await product.populate(["category", "supplier"])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sendSuccess(res, toPublicProduct(product as any), "Image removed")
})

const productBaseSchema = z.object({
  name: z.string().min(2).max(150),
  categoryId: z.string().min(1),
  fabricType: z.string().min(1).max(100),
  color: z.string().min(1).max(100),
  colorHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Enter a valid hex color"),
  composition: z.string().min(1).max(200),
  weightGsm: z.number().positive(),
  widthCm: z.number().positive(),
  pricePerUnit: z.number().positive(),
  unit: z.enum(["meter", "yard", "kg"]),
  moq: z.number().int().positive(),
  availability: z.enum(["in-stock", "limited", "made-to-order"]),
  leadTimeDays: z.number().int().nonnegative(),
  description: z.string().min(10).max(2000),
  tags: z.array(z.string()),
  isActive: z.boolean(),
})

// Separate schemas rather than productBaseSchema.partial() — partial() combined
// with .default() would silently reset omitted fields (e.g. tags) on every
// partial update, since Zod still applies defaults to absent keys.
export const createProductSchema = productBaseSchema.extend({
  tags: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
})
export const updateProductSchema = productBaseSchema.partial()

export const listMyProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ supplier: req.auth?.sub })
    .sort({ createdAt: -1 })
    .populate("category")
    .populate("supplier")

  sendSuccess(
    res,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    products.map((p) => toPublicProduct(p as any)),
  )
})

export const getMyProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, supplier: req.auth?.sub })
    .populate("category")
    .populate("supplier")

  if (!product) {
    throw new ApiError(404, "Product not found")
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sendSuccess(res, toPublicProduct(product as any))
})

export const createProduct = asyncHandler(async (req, res) => {
  const { categoryId, ...body } = req.body as z.infer<typeof createProductSchema>

  const category = await Category.findById(categoryId)
  if (!category) {
    throw new ApiError(400, "Select a valid category")
  }

  const slug = await generateUniqueSlug(body.name)

  const product = await Product.create({
    ...body,
    slug,
    category: categoryId,
    supplier: req.auth?.sub,
    currency: "USD",
  })

  await product.populate(["category", "supplier"])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sendSuccess(res, toPublicProduct(product as any), "Product created", 201)
})

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) {
    throw new ApiError(404, "Product not found")
  }

  if (String(product.supplier) !== req.auth?.sub) {
    throw new ApiError(403, "You do not own this product")
  }

  const { categoryId, ...body } = req.body as z.infer<typeof updateProductSchema>

  if (categoryId) {
    const category = await Category.findById(categoryId)
    if (!category) {
      throw new ApiError(400, "Select a valid category")
    }
    product.category = categoryId
  }

  Object.assign(product, body)
  await product.save()
  await product.populate(["category", "supplier"])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sendSuccess(res, toPublicProduct(product as any), "Product updated")
})

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) {
    throw new ApiError(404, "Product not found")
  }

  if (String(product.supplier) !== req.auth?.sub) {
    throw new ApiError(403, "You do not own this product")
  }

  await product.deleteOne()

  sendSuccess(res, null, "Product deleted")
})
