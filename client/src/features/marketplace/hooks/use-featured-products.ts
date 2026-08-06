import { useQuery } from "@tanstack/react-query"

import { fetchProducts } from "@/features/marketplace/api/marketplace-api"
import { emptyProductFilters } from "@/features/marketplace/default-filters"

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ["products", "featured-landing"],
    queryFn: () => fetchProducts(emptyProductFilters, "relevance", 0),
    staleTime: 5 * 60 * 1000,
  })
}
