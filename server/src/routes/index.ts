import { Router } from "express"

import { assistantRoutes } from "./assistant.routes.js"
import { authRoutes } from "./auth.routes.js"
import { categoriesRoutes } from "./categories.routes.js"
import { messagesRoutes } from "./messages.routes.js"
import { ordersRoutes } from "./orders.routes.js"
import { productsRoutes } from "./products.routes.js"
import { sampleRequestsRoutes } from "./sample-requests.routes.js"
import { suppliersRoutes } from "./suppliers.routes.js"
import { usersRoutes } from "./users.routes.js"
import { wishlistRoutes } from "./wishlist.routes.js"

export const apiRouter = Router()

apiRouter.use("/auth", authRoutes)
apiRouter.use("/users", usersRoutes)
apiRouter.use("/orders", ordersRoutes)
apiRouter.use("/products", productsRoutes)
apiRouter.use("/categories", categoriesRoutes)
apiRouter.use("/suppliers", suppliersRoutes)
apiRouter.use("/assistant", assistantRoutes)
apiRouter.use("/wishlist", wishlistRoutes)
apiRouter.use("/sample-requests", sampleRequestsRoutes)
apiRouter.use("/messages", messagesRoutes)
