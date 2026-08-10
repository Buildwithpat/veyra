import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { rfqApi } from "@/features/rfq/api/rfq-api"
import type { SubmitRfqResponseInput } from "@/features/rfq/types"
import { getErrorMessage } from "@/lib/errors"

export function useSubmitRfqResponse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ rfqId, input }: { rfqId: string; input: SubmitRfqResponseInput }) =>
      rfqApi.submitResponse(rfqId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rfq"] })
      toast.success("Quote submitted")
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Could not submit your quote. Try again."))
    },
  })
}
