import { useMutation, useQueryClient } from "@tanstack/react-query"

import { supplierProductsApi } from "@/features/supplier/api/supplier-products-api"

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: supplierProductsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplier", "products"] })
      queryClient.invalidateQueries({ queryKey: ["supplier", "dashboard-stats"] })
    },
  })
}
