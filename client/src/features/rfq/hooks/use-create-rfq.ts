import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { rfqApi } from "@/features/rfq/api/rfq-api"
import { getErrorMessage } from "@/lib/errors"

export function useCreateRfq() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: rfqApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rfq"] })
      toast.success("RFQ posted")
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Could not post your RFQ. Try again."))
    },
  })
}
