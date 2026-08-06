import type { Availability } from "@/features/marketplace/types"
import type { SupplierOrder } from "@/features/orders/types"

export interface ProductInput {
  name: string
  categoryId: string
  fabricType: string
  color: string
  colorHex: string
  composition: string
  weightGsm: number
  widthCm: number
  pricePerUnit: number
  unit: "meter" | "yard" | "kg"
  moq: number
  availability: Availability
  leadTimeDays: number
  description: string
  tags: string[]
  isActive: boolean
}

export interface DashboardStats {
  totalProducts: number
  activeProducts: number
  inventoryAlerts: number
  recentOrders: SupplierOrder[]
  profileCompletion: number
}
