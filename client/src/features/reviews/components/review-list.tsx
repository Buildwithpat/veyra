import { Star } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useProductReviews } from "@/features/reviews/hooks/use-product-reviews"
import { getInitials } from "@/lib/initials"

export function ReviewList({ productId }: { productId: string }) {
  const { data: reviews, isLoading } = useProductReviews(productId)

  if (isLoading) {
    return <p className="text-muted-foreground text-sm">Loading reviews...</p>
  }

  if (!reviews || reviews.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No reviews yet — be the first to leave one after your order is complete.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {reviews.map((review) => (
        <div key={review.id} className="border-border flex gap-3 border-b pb-4 last:border-0">
          <Avatar>
            <AvatarFallback>{getInitials(review.buyerName)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col gap-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-foreground text-sm font-medium">{review.buyerName}</p>
              <p className="text-muted-foreground text-xs">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={
                    i < review.rating
                      ? "fill-warning text-warning size-3.5"
                      : "text-muted-foreground size-3.5"
                  }
                />
              ))}
            </div>
            <p className="text-foreground text-sm">{review.comment}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
