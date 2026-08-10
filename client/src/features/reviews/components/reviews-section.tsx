import { Star } from "lucide-react"

import { AiVerdictButton } from "@/features/reviews/components/ai-verdict-button"
import { ReviewList } from "@/features/reviews/components/review-list"
import { WriteReviewForm } from "@/features/reviews/components/write-review-form"

export function ReviewsSection({
  productId,
  rating,
  reviewCount,
}: {
  productId: string
  rating: number
  reviewCount: number
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-foreground text-lg font-semibold">Reviews</h2>
          <div className="text-muted-foreground flex items-center gap-1 text-sm">
            <Star className="fill-warning text-warning size-4" />
            {rating.toFixed(1)}
            <span>({reviewCount})</span>
          </div>
        </div>
        <AiVerdictButton productId={productId} reviewCount={reviewCount} />
      </div>

      <WriteReviewForm productId={productId} />
      <ReviewList productId={productId} />
    </div>
  )
}
