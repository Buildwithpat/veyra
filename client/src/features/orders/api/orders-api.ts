import { apiClient } from "@/lib/api-client"
import type { CreateOrderInput, Order } from "@/features/orders/types"
import type { ApiSuccess } from "@/types/api"

export const ordersApi = {
  async create(input: CreateOrderInput) {
    const { data } = await apiClient.post<ApiSuccess<Order>>("/orders", input)
    return data.data
  },

  async list() {
    const { data } = await apiClient.get<ApiSuccess<Order[]>>("/orders")
    return data.data
  },

  async get(id: string) {
    const { data } = await apiClient.get<ApiSuccess<Order>>(`/orders/${id}`)
    return data.data
  },
}
