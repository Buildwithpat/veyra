import { useQuery } from "@tanstack/react-query"

import { supplierProductsApi } from "@/features/supplier/api/supplier-products-api"

export function useMyProducts() {
  return useQuery({
    queryKey: ["supplier", "products"],
    queryFn: supplierProductsApi.listMine,
  })
}
