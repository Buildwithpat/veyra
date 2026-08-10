import { useQuery } from "@tanstack/react-query"

import { sampleRequestsApi } from "@/features/samples/api/sample-requests-api"
import type { SampleRequestStatus } from "@/features/samples/types"

export function useMySampleRequests(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["sample-requests", "mine"],
    queryFn: sampleRequestsApi.listMine,
    enabled: options?.enabled ?? true,
  })
}

export function useIncomingSampleRequests(status?: SampleRequestStatus) {
  return useQuery({
    queryKey: ["sample-requests", "incoming", status ?? "all"],
    queryFn: () => sampleRequestsApi.listIncoming(status),
  })
}
