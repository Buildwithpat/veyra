import { useQuery } from "@tanstack/react-query"

import { supplierProductsApi } from "@/features/supplier/api/supplier-products-api"

export function useMyProduct(id: string | undefined) {
  return useQuery({
    queryKey: ["supplier", "products", id],
    queryFn: () => supplierProductsApi.getMine(id ?? ""),
    enabled: Boolean(id),
  })
}
