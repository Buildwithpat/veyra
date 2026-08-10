import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Award } from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useCategories } from "@/features/marketplace/hooks/use-categories"
import { AcceptQuoteDialog } from "@/features/rfq/components/accept-quote-dialog"
import { RfqStatusBadge } from "@/features/rfq/components/rfq-status-badge"
import { useMyRfq } from "@/features/rfq/hooks/use-my-rfq"
import type { RfqResponse } from "@/features/rfq/types"
import { useDocumentTitle } from "@/hooks/use-document-title"
import { formatPrice } from "@/lib/format"

function formatRfqDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function ResponseRow({
  response,
  canAccept,
  onAccept,
}: {
  response: RfqResponse
  canAccept: boolean
  onAccept: (response: RfqResponse) => void
}) {
  const statusVariant =
    response.status === "accepted"
      ? "success"
      : response.status === "rejected" || response.status === "withdrawn"
        ? "outline"
        : "secondary"

  return (
    <div className="border-border bg-card flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-foreground text-sm font-medium">{response.supplierName}</p>
          <Badge variant={statusVariant}>{response.status}</Badge>
        </div>
        <p className="text-muted-foreground mt-1 text-xs">
          {formatPrice(response.pricePerUnit)} / unit &middot; MOQ {response.moq} &middot;{" "}
          {response.leadTimeDays} day lead time
        </p>
        {response.note && (
          <p className="text-muted-foreground mt-1 text-xs italic">
            &ldquo;{response.note}&rdquo;
          </p>
        )}
      </div>

      {canAccept && response.status === "submitted" && (
        <Button size="sm" className="gap-2" onClick={() => onAccept(response)}>
          <Award className="size-3.5" />
          Accept
        </Button>
      )}
    </div>
  )
}

export function DashboardRfqDetailPage() {
  useDocumentTitle("RFQ Details")
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: rfq, isPending } = useMyRfq(id)
  const { data: categories = [] } = useCategories()
  const [acceptTarget, setAcceptTarget] = useState<RfqResponse | null>(null)

  if (isPending) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!rfq) {
    return (
      <EmptyState
        title="RFQ not found"
        description="This RFQ may not exist or doesn't belong to your account."
      />
    )
  }

  const categoryName = categories.find((c) => c.id === rfq.categorySlug)?.name ?? rfq.categorySlug
  const sortedResponses = [...rfq.responses].sort((a, b) => a.pricePerUnit - b.pricePerUnit)
  const canAccept = rfq.status === "open"

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          to="/dashboard/rfqs"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm"
        >
          <ArrowLeft className="size-3.5" />
          Back to RFQs
        </Link>
        <div className="mt-2 flex items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">{rfq.title}</h1>
          <RfqStatusBadge status={rfq.status} />
        </div>
        <p className="text-muted-foreground text-sm">
          Posted {formatRfqDate(rfq.createdAt)}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Spec</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm">
          <p className="text-muted-foreground">{rfq.description}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
            <span>
              <span className="text-muted-foreground">Category: </span>
              <span className="text-foreground font-medium">{categoryName}</span>
            </span>
            <span>
              <span className="text-muted-foreground">Quantity: </span>
              <span className="text-foreground font-medium">
                {rfq.quantity} {rfq.unit}s
              </span>
            </span>
            {rfq.targetPriceMax && (
              <span>
                <span className="text-muted-foreground">Target price: </span>
                <span className="text-foreground font-medium">
                  up to {formatPrice(rfq.targetPriceMax)} / unit
                </span>
              </span>
            )}
            {rfq.deadline && (
              <span>
                <span className="text-muted-foreground">Need by: </span>
                <span className="text-foreground font-medium">
                  {formatRfqDate(rfq.deadline)}
                </span>
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-foreground mb-3 text-base font-semibold">
          Quotes ({sortedResponses.length})
        </h2>
        {sortedResponses.length === 0 ? (
          <EmptyState
            title="No quotes yet"
            description="Suppliers active in this category will be able to submit quotes here."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {sortedResponses.map((response) => (
              <ResponseRow
                key={response.id}
                response={response}
                canAccept={canAccept}
                onAccept={setAcceptTarget}
              />
            ))}
          </div>
        )}
      </div>

      {acceptTarget && (
        <AcceptQuoteDialog
          rfqId={rfq.id}
          response={acceptTarget}
          open={Boolean(acceptTarget)}
          onOpenChange={(open) => {
            if (!open) setAcceptTarget(null)
          }}
          onAccepted={(orderId) => navigate(`/dashboard/orders/${orderId}`)}
        />
      )}
    </div>
  )
}
