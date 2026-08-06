import { useMutation, useQueryClient } from "@tanstack/react-query"

import { supplierProductsApi } from "@/features/supplier/api/supplier-products-api"
import type { ProductInput } from "@/features/supplier/types"

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<ProductInput> }) =>
      supplierProductsApi.update(id, input),
    onSuccess: (product) => {
      queryClient.invalidateQueries({ queryKey: ["supplier", "products"] })
      queryClient.invalidateQueries({ queryKey: ["supplier", "dashboard-stats"] })
      queryClient.setQueryData(["supplier", "products", product.id], product)
    },
  })
}
