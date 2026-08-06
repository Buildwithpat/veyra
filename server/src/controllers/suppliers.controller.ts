import { Order } from "../models/order.model.js"
import { Product } from "../models/product.model.js"
import { User } from "../models/user.model.js"
import { ApiError, sendSuccess } from "../utils/api-response.js"
import { asyncHandler } from "../utils/async-handler.js"
import { toSupplierOrderResponse } from "./orders.controller.js"
import { computeSupplierProfileCompletion } from "../utils/serialize-supplier.js"

export const getDashboardStats = asyncHandler(async (req, res) => {
  const supplierId = req.auth!.sub

  const [totalProducts, activeProducts, inventoryAlerts, recentOrders, user] =
    await Promise.all([
      Product.countDocuments({ supplier: supplierId }),
      Product.countDocuments({ supplier: supplierId, isActive: true }),
      Product.countDocuments({ supplier: supplierId, availability: "limited" }),
      Order.find({ "items.supplierId": supplierId }).sort({ createdAt: -1 }).limit(5),
      User.findById(supplierId),
    ])

  if (!user) {
    throw new ApiError(404, "User not found")
  }

  sendSuccess(res, {
    totalProducts,
    activeProducts,
    inventoryAlerts,
    recentOrders: recentOrders.map((order) => toSupplierOrderResponse(order, supplierId)),
    profileCompletion: computeSupplierProfileCompletion(user),
  })
})
