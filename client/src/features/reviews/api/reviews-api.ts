import { apiClient } from "@/lib/api-client"
import type {
  Review,
  ReviewEligibility,
  ReviewSummary,
  SubmitReviewInput,
} from "@/features/reviews/types"
import type { ApiSuccess } from "@/types/api"

export const reviewsApi = {
  async list(productId: string, limit?: number) {
    const { data } = await apiClient.get<ApiSuccess<Review[]>>(
      `/reviews/product/${productId}`,
      { params: limit ? { limit } : undefined },
    )
    return data.data
  },

  async getEligibility(productId: string) {
    const { data } = await apiClient.get<ApiSuccess<ReviewEligibility>>(
      `/reviews/product/${productId}/eligibility`,
    )
    return data.data
  },

  async submit(productId: string, input: SubmitReviewInput) {
    const { data } = await apiClient.post<ApiSuccess<Review>>(
      `/reviews/product/${productId}`,
      input,
    )
    return data.data
  },

  async getSummary(productId: string) {
    const { data } = await apiClient.get<ApiSuccess<ReviewSummary>>(
      `/reviews/product/${productId}/summary`,
    )
    return data.data
  },
}
