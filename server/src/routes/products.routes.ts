import { Router } from "express"
import multer from "multer"

import {
  addProductImage,
  createProduct,
  createProductSchema,
  deleteProduct,
  getMyProduct,
  getProductBySlug,
  getProductFilterOptions,
  getSimilarProducts,
  listMyProducts,
  listProducts,
  removeProductImage,
  removeProductImageSchema,
  updateProduct,
  updateProductSchema,
} from "../controllers/products.controller.js"
import { requireAuth, requireRole } from "../middleware/auth.js"
import { validateBody } from "../utils/validate.js"

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
})
const supplierOnly = [requireAuth, requireRole("supplier")] as const

export const productsRoutes = Router()

// Supplier-owned routes — registered before the public "/:slug" routes so
// literal paths like "/mine" aren't swallowed as a slug param.
productsRoutes.get("/mine", ...supplierOnly, listMyProducts)
productsRoutes.get("/mine/:id", ...supplierOnly, getMyProduct)
productsRoutes.post(
  "/",
  ...supplierOnly,
  validateBody(createProductSchema),
  createProduct,
)
productsRoutes.patch(
  "/:id",
  ...supplierOnly,
  validateBody(updateProductSchema),
  updateProduct,
)
productsRoutes.delete("/:id", ...supplierOnly, deleteProduct)
productsRoutes.post(
  "/:id/images",
  ...supplierOnly,
  upload.single("image"),
  addProductImage,
)
productsRoutes.delete(
  "/:id/images",
  ...supplierOnly,
  validateBody(removeProductImageSchema),
  removeProductImage,
)

// Public routes
productsRoutes.get("/filters", getProductFilterOptions)
productsRoutes.get("/", listProducts)
productsRoutes.get("/:slug", getProductBySlug)
productsRoutes.get("/:slug/similar", getSimilarProducts)
