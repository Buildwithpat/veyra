import { useState } from "react"
import { Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useReviewEligibility } from "@/features/reviews/hooks/use-review-eligibility"
import { useSubmitReview } from "@/features/reviews/hooks/use-submit-review"

export function WriteReviewForm({ productId }: { productId: string }) {
  const { data: eligibility } = useReviewEligibility(productId)
  const submitReview = useSubmitReview(productId)

  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")

  if (!eligibility?.canReview) {
    return null
  }

  const canSubmit = rating > 0 && comment.trim().length >= 10

  function handleSubmit() {
    if (!canSubmit) return
    submitReview.mutate(
      { rating, comment: comment.trim() },
      {
        onSuccess: () => {
          setRating(0)
          setComment("")
        },
      },
    )
  }

  return (
    <div className="border-border bg-card flex flex-col gap-3 rounded-lg border p-4">
      <p className="text-foreground text-sm font-medium">
        {eligibility.hasReviewed ? "Update your review" : "Write a review"}
      </p>

      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => {
          const value = i + 1
          return (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              aria-label={`Rate ${value} star${value === 1 ? "" : "s"}`}
            >
              <Star
                className={
                  value <= rating
                    ? "fill-warning text-warning size-5"
                    : "text-muted-foreground size-5"
                }
              />
            </button>
          )
        })}
      </div>

      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience with this fabric — quality, accuracy of description, supplier communication..."
        rows={3}
        maxLength={1000}
      />

      <Button
        size="sm"
        className="self-start"
        disabled={!canSubmit || submitReview.isPending}
        onClick={handleSubmit}
      >
        {submitReview.isPending
          ? "Submitting..."
          : eligibility.hasReviewed
            ? "Update review"
            : "Submit review"}
      </Button>
    </div>
  )
}
