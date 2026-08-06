import { useQuery } from "@tanstack/react-query"

import { supplierOrdersApi } from "@/features/supplier/api/supplier-orders-api"

export function useIncomingOrder(id: string | undefined) {
  return useQuery({
    queryKey: ["supplier", "orders", "detail", id],
    queryFn: () => supplierOrdersApi.getIncoming(id ?? ""),
    enabled: Boolean(id),
  })
}
