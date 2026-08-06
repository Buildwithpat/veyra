import { useQuery } from "@tanstack/react-query"

import { supplierOrdersApi } from "@/features/supplier/api/supplier-orders-api"

export function useIncomingOrders(limit?: number) {
  return useQuery({
    queryKey: ["supplier", "orders", { limit }],
    queryFn: () => supplierOrdersApi.listIncoming(limit),
  })
}
