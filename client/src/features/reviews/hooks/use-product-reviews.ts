import { useQuery } from "@tanstack/react-query"

import { reviewsApi } from "@/features/reviews/api/reviews-api"

export function useProductReviews(productId: string) {
  return useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => reviewsApi.list(productId),
    enabled: Boolean(productId),
  })
}
