import { useQuery } from "@tanstack/react-query"

import { wishlistApi } from "@/features/wishlist/api/wishlist-api"

export function useWishlist() {
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: wishlistApi.list,
  })
}
