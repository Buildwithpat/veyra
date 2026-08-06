import { useMutation, useQueryClient } from "@tanstack/react-query"

import { supplierProductsApi } from "@/features/supplier/api/supplier-products-api"

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: supplierProductsApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplier", "products"] })
      queryClient.invalidateQueries({ queryKey: ["supplier", "dashboard-stats"] })
    },
  })
}
