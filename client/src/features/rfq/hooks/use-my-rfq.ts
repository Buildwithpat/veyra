import { useQuery } from "@tanstack/react-query"

import { rfqApi } from "@/features/rfq/api/rfq-api"

export function useMyRfq(id: string | undefined) {
  return useQuery({
    queryKey: ["rfq", "mine", id],
    queryFn: () => rfqApi.getMine(id ?? ""),
    enabled: Boolean(id),
  })
}
