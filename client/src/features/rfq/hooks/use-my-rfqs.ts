import { useQuery } from "@tanstack/react-query"

import { rfqApi } from "@/features/rfq/api/rfq-api"

export function useMyRfqs(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["rfq", "mine"],
    queryFn: rfqApi.listMine,
    enabled: options?.enabled ?? true,
  })
}
