import { useMutation, useQueryClient } from "@tanstack/react-query"

import { supplierOrdersApi } from "@/features/supplier/api/supplier-orders-api"
import type { OrderStatus } from "@/features/orders/types"

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      supplierOrdersApi.updateStatus(id, status),
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ["supplier", "orders"] })
      queryClient.invalidateQueries({ queryKey: ["supplier", "dashboard-stats"] })
      queryClient.setQueryData(["supplier", "orders", "detail", order.id], order)
    },
  })
}
