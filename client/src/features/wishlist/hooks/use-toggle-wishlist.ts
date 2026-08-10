import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { wishlistApi } from "@/features/wishlist/api/wishlist-api"

export function useToggleWishlist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ productId, isWishlisted }: { productId: string; isWishlisted: boolean }) =>
      isWishlisted ? wishlistApi.remove(productId) : wishlistApi.add(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] })
      queryClient.invalidateQueries({ queryKey: ["wishlist-status"] })
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.")
    },
  })
}
