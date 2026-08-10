import { Heart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { useToggleWishlist } from "@/features/wishlist/hooks/use-toggle-wishlist"
import { useWishlistStatus } from "@/features/wishlist/hooks/use-wishlist-status"
import { cn } from "@/lib/utils"

export function WishlistButton({
  productId,
  className,
}: {
  productId: string
  className?: string
}) {
  const { user } = useAuth()
  const { data: status } = useWishlistStatus([productId])
  const toggleWishlist = useToggleWishlist()

  if (user?.role !== "buyer") {
    return null
  }

  const isWishlisted = status?.[productId] ?? false

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist.mutate({ productId, isWishlisted })
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleClick}
      disabled={toggleWishlist.isPending}
      aria-label={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}
      className={cn(
        "size-8 rounded-full bg-card/90 shadow-sm backdrop-blur hover:bg-card",
        className,
      )}
    >
      <Heart
        className={cn(
          "size-4 transition-colors",
          isWishlisted ? "fill-destructive text-destructive" : "text-foreground",
        )}
      />
    </Button>
  )
}
