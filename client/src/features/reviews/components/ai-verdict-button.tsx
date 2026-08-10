import { VeyraAiIcon } from "@/components/shared/veyra-ai-icon"
import { Button } from "@/components/ui/button"
import { useReviewSummary } from "@/features/reviews/hooks/use-review-summary"

export function AiVerdictButton({
  productId,
  reviewCount,
}: {
  productId: string
  reviewCount: number
}) {
  const summary = useReviewSummary()

  if (reviewCount === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={summary.isPending}
        onClick={() => summary.mutate(productId)}
      >
        <VeyraAiIcon />
        {summary.isPending ? "Summarizing..." : "Get AI verdict"}
      </Button>

      {summary.data?.verdict ? (
        <div className="border-border bg-accent/40 rounded-lg border p-3 text-sm">
          <p className="text-foreground font-medium">
            {summary.data.averageRating.toFixed(1)}/5 average
          </p>
          <p className="text-muted-foreground mt-1">{summary.data.verdict}</p>
        </div>
      ) : null}
    </div>
  )
}
