import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { reviewsApi } from "@/features/reviews/api/reviews-api"
import { getErrorMessage } from "@/lib/errors"

export function useReviewSummary() {
  return useMutation({
    mutationFn: (productId: string) => reviewsApi.getSummary(productId),
    onError: (error) => {
      toast.error(getErrorMessage(error, "Couldn't generate an AI verdict right now."))
    },
  })
}
