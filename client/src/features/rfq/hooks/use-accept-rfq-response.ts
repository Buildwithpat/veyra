import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { rfqApi } from "@/features/rfq/api/rfq-api"
import type { AcceptRfqResponseInput } from "@/features/rfq/types"
import { getErrorMessage } from "@/lib/errors"

export function useAcceptRfqResponse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      rfqId,
      responseId,
      shipping,
    }: {
      rfqId: string
      responseId: string
      shipping: AcceptRfqResponseInput
    }) => rfqApi.acceptResponse(rfqId, responseId, shipping),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rfq"] })
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      toast.success("Quote accepted — order created")
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Could not accept this quote. Try again."))
    },
  })
}
