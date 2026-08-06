import { apiClient } from "@/lib/api-client"
import type { OrderStatus, SupplierOrder } from "@/features/orders/types"
import type { ApiSuccess } from "@/types/api"

export const supplierOrdersApi = {
  async listIncoming(limit?: number) {
    const { data } = await apiClient.get<ApiSuccess<SupplierOrder[]>>(
      "/orders/incoming",
      {
        params: { limit },
      },
    )
    return data.data
  },

  async getIncoming(id: string) {
    const { data } = await apiClient.get<ApiSuccess<SupplierOrder>>(
      `/orders/incoming/${id}`,
    )
    return data.data
  },

  async updateStatus(id: string, status: OrderStatus) {
    const { data } = await apiClient.patch<ApiSuccess<SupplierOrder>>(
      `/orders/${id}/status`,
      {
        status,
      },
    )
    return data.data
  },
}
