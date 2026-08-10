import { useQuery } from "@tanstack/react-query"

import { useAuth } from "@/features/auth/hooks/use-auth"
import { reviewsApi } from "@/features/reviews/api/reviews-api"
import type { ReviewEligibility } from "@/features/reviews/types"

const SAFE_DEFAULT: ReviewEligibility = { canReview: false, hasReviewed: false }

export function useReviewEligibility(productId: string) {
  const { isAuthenticated, user } = useAuth()
  const enabled = Boolean(productId) && isAuthenticated && user?.role === "buyer"

  return useQuery({
    queryKey: ["reviews", "eligibility", productId],
    queryFn: () => reviewsApi.getEligibility(productId),
    enabled,
    initialData: enabled ? undefined : SAFE_DEFAULT,
  })
}
