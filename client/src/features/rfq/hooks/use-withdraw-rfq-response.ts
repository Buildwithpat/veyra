import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { rfqApi } from "@/features/rfq/api/rfq-api"
import { getErrorMessage } from "@/lib/errors"

export function useWithdrawRfqResponse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ rfqId, responseId }: { rfqId: string; responseId: string }) =>
      rfqApi.withdrawResponse(rfqId, responseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rfq"] })
      toast.success("Quote withdrawn")
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Could not withdraw your quote. Try again."))
    },
  })
}
