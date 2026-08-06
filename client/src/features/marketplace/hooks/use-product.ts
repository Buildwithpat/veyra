import { useQuery } from "@tanstack/react-query"

import {
  fetchProductBySlug,
  fetchSimilarProducts,
} from "@/features/marketplace/api/marketplace-api"
import type { Product } from "@/features/marketplace/types"

export function useProduct(slug: string | undefined) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProductBySlug(slug ?? ""),
    enabled: Boolean(slug),
  })
}

export function useSimilarProducts(product: Product | null | undefined) {
  return useQuery({
    queryKey: ["similar-products", product?.id],
    queryFn: () => fetchSimilarProducts(product!),
    enabled: Boolean(product),
  })
}
