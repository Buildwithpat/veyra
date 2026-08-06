import { useInfiniteQuery } from "@tanstack/react-query"

import { fetchProducts } from "@/features/marketplace/api/marketplace-api"
import type { ProductFilters, SortOption } from "@/features/marketplace/types"

export function useProducts(filters: ProductFilters, sort: SortOption) {
  return useInfiniteQuery({
    queryKey: ["products", filters, sort],
    queryFn: ({ pageParam }) => fetchProducts(filters, sort, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  })
}
