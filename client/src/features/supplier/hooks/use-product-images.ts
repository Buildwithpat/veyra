import { useMutation, useQueryClient } from "@tanstack/react-query"

import { supplierProductsApi } from "@/features/supplier/api/supplier-products-api"

export function useUploadProductImage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      supplierProductsApi.uploadImage(id, file),
    onSuccess: (product) => {
      queryClient.setQueryData(["supplier", "products", product.id], product)
      queryClient.invalidateQueries({ queryKey: ["supplier", "products"] })
    },
  })
}

export function useRemoveProductImage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, url }: { id: string; url: string }) =>
      supplierProductsApi.removeImage(id, url),
    onSuccess: (product) => {
      queryClient.setQueryData(["supplier", "products", product.id], product)
      queryClient.invalidateQueries({ queryKey: ["supplier", "products"] })
    },
  })
}
