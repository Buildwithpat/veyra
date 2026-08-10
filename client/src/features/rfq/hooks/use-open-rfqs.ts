import { useQuery } from "@tanstack/react-query"

import { rfqApi } from "@/features/rfq/api/rfq-api"

export function useOpenRfqs(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["rfq", "open"],
    queryFn: rfqApi.listOpen,
    enabled: options?.enabled ?? true,
  })
}
