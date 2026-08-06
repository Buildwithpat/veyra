import { useQuery } from "@tanstack/react-query"

import { ordersApi } from "@/features/orders/api/orders-api"

export function useOrder(id: string | undefined) {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => ordersApi.get(id ?? ""),
    enabled: Boolean(id),
  })
}
