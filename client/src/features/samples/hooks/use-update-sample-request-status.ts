import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { sampleRequestsApi } from "@/features/samples/api/sample-requests-api"
import type { SampleRequestStatus } from "@/features/samples/types"
import { getErrorMessage } from "@/lib/errors"

export function useUpdateSampleRequestStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string
      status: Exclude<SampleRequestStatus, "pending">
    }) => sampleRequestsApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sample-requests", "incoming"] })
      toast.success("Sample request updated")
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Could not update the sample request. Try again."))
    },
  })
}
