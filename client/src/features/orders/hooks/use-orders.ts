import { useQuery } from "@tanstack/react-query"

import { ordersApi } from "@/features/orders/api/orders-api"

export function useOrders(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["orders"],
    queryFn: ordersApi.list,
    enabled: options?.enabled ?? true,
  })
}
