import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { reviewsApi } from "@/features/reviews/api/reviews-api"
import type { SubmitReviewInput } from "@/features/reviews/types"
import { getErrorMessage } from "@/lib/errors"

export function useSubmitReview(productId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: SubmitReviewInput) => reviewsApi.submit(productId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] })
      toast.success("Review submitted")
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Couldn't submit your review. Please try again."))
    },
  })
}
