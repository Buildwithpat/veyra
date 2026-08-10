import { useState } from "react"
import { AlertTriangle, FileText } from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useCategories } from "@/features/marketplace/hooks/use-categories"
import { RfqStatusBadge } from "@/features/rfq/components/rfq-status-badge"
import { SubmitQuoteDialog } from "@/features/rfq/components/submit-quote-dialog"
import { useOpenRfqs } from "@/features/rfq/hooks/use-open-rfqs"
import { useWithdrawRfqResponse } from "@/features/rfq/hooks/use-withdraw-rfq-response"
import type { OpenRfqForSupplier } from "@/features/rfq/types"
import { useDocumentTitle } from "@/hooks/use-document-title"
import { formatPrice } from "@/lib/format"

function OpenRfqCard({
  rfq,
  categoryName,
  onSubmitQuote,
}: {
  rfq: OpenRfqForSupplier
  categoryName: string
  onSubmitQuote: (rfq: OpenRfqForSupplier) => void
}) {
  const withdrawResponse = useWithdrawRfqResponse()

  return (
    <Card>
      <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-6">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-foreground text-sm font-medium">{rfq.title}</p>
            <RfqStatusBadge status={rfq.status} />
          </div>
          <p className="text-muted-foreground mt-1 text-xs">{rfq.description}</p>
          <p className="text-muted-foreground mt-1 text-xs">
            {categoryName} &middot; {rfq.quantity} {rfq.unit}s
            {rfq.targetPriceMax ? (
              <> &middot; target up to {formatPrice(rfq.targetPriceMax)} / unit</>
            ) : null}
          </p>
        </div>

        {rfq.hasResponded ? (
          <div className="flex shrink-0 items-center gap-3">
            <span className="text-muted-foreground text-sm">Quote submitted</span>
            {rfq.myResponseId && (
              <Button
                variant="outline"
                size="sm"
                disabled={withdrawResponse.isPending}
                onClick={() =>
                  withdrawResponse.mutate({ rfqId: rfq.id, responseId: rfq.myResponseId! })
                }
              >
                Withdraw
              </Button>
            )}
          </div>
        ) : (
          <Button size="sm" className="shrink-0" onClick={() => onSubmitQuote(rfq)}>
            Submit quote
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export function SupplierRfqsPage() {
  useDocumentTitle("Open RFQs")
  const { data: rfqs, isPending, isError, refetch } = useOpenRfqs()
  const { data: categories = [] } = useCategories()
  const [quoteTarget, setQuoteTarget] = useState<OpenRfqForSupplier | null>(null)

  const categoryNameBySlug = new Map(categories.map((c) => [c.id, c.name]))

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Open RFQs</h1>
        <p className="text-muted-foreground text-sm">
          Sourcing requests from buyers in categories where you have active listings.
        </p>
      </div>

      {isPending ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[96px] w-full rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <EmptyState
          icon={AlertTriangle}
          title="Couldn't load open RFQs"
          description="Something went wrong reaching the server."
          actionLabel="Retry"
          onAction={() => refetch()}
        />
      ) : !rfqs || rfqs.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No open RFQs"
          description="Sourcing requests from buyers in your categories will show up here."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {rfqs.map((rfq) => (
            <OpenRfqCard
              key={rfq.id}
              rfq={rfq}
              categoryName={categoryNameBySlug.get(rfq.categorySlug) ?? rfq.categorySlug}
              onSubmitQuote={setQuoteTarget}
            />
          ))}
        </div>
      )}

      {quoteTarget && (
        <SubmitQuoteDialog
          rfq={quoteTarget}
          open={Boolean(quoteTarget)}
          onOpenChange={(open) => {
            if (!open) setQuoteTarget(null)
          }}
        />
      )}
    </div>
  )
}
