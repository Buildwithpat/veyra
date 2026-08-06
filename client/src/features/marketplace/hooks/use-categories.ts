import { useQuery } from "@tanstack/react-query"

import { fetchCategories } from "@/features/marketplace/api/marketplace-api"

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: Infinity,
  })
}
