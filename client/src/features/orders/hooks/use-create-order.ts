import { useMutation, useQueryClient } from "@tanstack/react-query"

import { ordersApi } from "@/features/orders/api/orders-api"

export function useCreateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ordersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
    },
  })
}
