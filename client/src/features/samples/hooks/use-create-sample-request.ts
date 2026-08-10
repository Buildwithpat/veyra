import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { sampleRequestsApi } from "@/features/samples/api/sample-requests-api"
import { getErrorMessage } from "@/lib/errors"

export function useCreateSampleRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: sampleRequestsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sample-requests", "mine"] })
      toast.success("Sample request sent")
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Could not send your sample request. Try again."))
    },
  })
}
