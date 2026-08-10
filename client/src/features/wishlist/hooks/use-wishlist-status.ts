import { useQuery } from "@tanstack/react-query"

import { wishlistApi } from "@/features/wishlist/api/wishlist-api"

export function useWishlistStatus(productIds: string[]) {
  const sortedIds = [...productIds].sort()

  return useQuery({
    queryKey: ["wishlist-status", sortedIds],
    queryFn: () => wishlistApi.status(sortedIds),
    enabled: sortedIds.length > 0,
    initialData: sortedIds.length === 0 ? {} : undefined,
  })
}
