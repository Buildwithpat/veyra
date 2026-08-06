import axios from "axios"

import { apiClient } from "@/lib/api-client"
import type {
  Category,
  FilterOptions,
  Product,
  ProductFilters,
  SortOption,
} from "@/features/marketplace/types"
import type { ApiSuccess } from "@/types/api"

export interface ProductsPage {
  items: Product[]
  nextPage: number | null
  total: number
}

export async function fetchProducts(
  filters: ProductFilters,
  sort: SortOption,
  page: number,
): Promise<ProductsPage> {
  const { data } = await apiClient.get<ApiSuccess<ProductsPage>>("/products", {
    params: {
      q: filters.search || undefined,
      category: filters.categoryIds.length ? filters.categoryIds : undefined,
      color: filters.colors.length ? filters.colors : undefined,
      priceMin: filters.priceMin ?? undefined,
      priceMax: filters.priceMax ?? undefined,
      moqMax: filters.moqMax ?? undefined,
      availability: filters.availability.length ? filters.availability : undefined,
      sort,
      page,
    },
  })
  return data.data
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { data } = await apiClient.get<ApiSuccess<Product>>(`/products/${slug}`)
    return data.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) return null
    throw error
  }
}

export async function fetchSimilarProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  const { data } = await apiClient.get<ApiSuccess<Product[]>>(
    `/products/${product.slug}/similar`,
    { params: { limit } },
  )
  return data.data
}

export async function fetchCategories(): Promise<Category[]> {
  const { data } = await apiClient.get<ApiSuccess<Category[]>>("/categories")
  return data.data
}

export async function fetchProductFilterOptions(): Promise<FilterOptions> {
  const { data } = await apiClient.get<ApiSuccess<FilterOptions>>("/products/filters")
  return data.data
}
