import { useQuery } from "@tanstack/react-query"

import { fetchProductFilterOptions } from "@/features/marketplace/api/marketplace-api"

const fallback = {
  colors: [],
  priceBounds: { min: 0, max: 100 },
  moqBounds: { min: 0, max: 1000 },
}

export function useFilterOptions() {
  const { data } = useQuery({
    queryKey: ["product-filter-options"],
    queryFn: fetchProductFilterOptions,
    staleTime: 5 * 60 * 1000,
  })

  return data ?? fallback
}
