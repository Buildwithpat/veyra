import { apiClient } from "@/lib/api-client"
import type { WishlistedProduct } from "@/features/wishlist/types"
import type { ApiSuccess } from "@/types/api"

export const wishlistApi = {
  async add(productId: string) {
    const { data } = await apiClient.post<ApiSuccess<{ id: string }>>("/wishlist", {
      productId,
    })
    return data.data
  },

  async remove(productId: string) {
    const { data } = await apiClient.delete<ApiSuccess<null>>(`/wishlist/${productId}`)
    return data.data
  },

  async list() {
    const { data } = await apiClient.get<ApiSuccess<WishlistedProduct[]>>("/wishlist")
    return data.data
  },

  async status(productIds: string[]) {
    const { data } = await apiClient.get<ApiSuccess<Record<string, boolean>>>(
      "/wishlist/status",
      { params: { productIds: productIds.join(",") } },
    )
    return data.data
  },
}
