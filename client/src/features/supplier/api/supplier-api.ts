import { apiClient } from "@/lib/api-client"
import type { DashboardStats } from "@/features/supplier/types"
import type { ApiSuccess } from "@/types/api"

export const supplierApi = {
  async getDashboardStats() {
    const { data } =
      await apiClient.get<ApiSuccess<DashboardStats>>("/suppliers/me/stats")
    return data.data
  },
}
