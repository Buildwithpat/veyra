import { apiClient } from "@/lib/api-client"
import type { Product } from "@/features/marketplace/types"
import type { ProductInput } from "@/features/supplier/types"
import type { ApiSuccess } from "@/types/api"

export const supplierProductsApi = {
  async listMine() {
    const { data } = await apiClient.get<ApiSuccess<Product[]>>("/products/mine")
    return data.data
  },

  async getMine(id: string) {
    const { data } = await apiClient.get<ApiSuccess<Product>>(`/products/mine/${id}`)
    return data.data
  },

  async create(input: ProductInput) {
    const { data } = await apiClient.post<ApiSuccess<Product>>("/products", input)
    return data.data
  },

  async update(id: string, input: Partial<ProductInput>) {
    const { data } = await apiClient.patch<ApiSuccess<Product>>(`/products/${id}`, input)
    return data.data
  },

  async remove(id: string) {
    await apiClient.delete(`/products/${id}`)
  },

  async uploadImage(id: string, file: File) {
    const formData = new FormData()
    formData.append("image", file)
    const { data } = await apiClient.post<ApiSuccess<Product>>(
      `/products/${id}/images`,
      formData,
    )
    return data.data
  },

  async removeImage(id: string, url: string) {
    const { data } = await apiClient.delete<ApiSuccess<Product>>(
      `/products/${id}/images`,
      {
        data: { url },
      },
    )
    return data.data
  },
}
