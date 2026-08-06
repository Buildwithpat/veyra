import { Router } from "express"

import { listCategories } from "../controllers/categories.controller.js"

export const categoriesRoutes = Router()

categoriesRoutes.get("/", listCategories)
