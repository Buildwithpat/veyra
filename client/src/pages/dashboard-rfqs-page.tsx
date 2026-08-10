import { useState } from "react"
import { Link } from "react-router-dom"
import { AlertTriangle, ChevronRight, FileText, Plus } from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useCategories } from "@/features/marketplace/hooks/use-categories"
import { CreateRfqDialog } from "@/features/rfq/components/create-rfq-dialog"
import { RfqStatusBadge } from "@/features/rfq/components/rfq-status-badge"
import { useMyRfqs } from "@/features/rfq/hooks/use-my-rfqs"
import type { RfqRequest } from "@/features/rfq/types"
import { useDocumentTitle } from "@/hooks/use-document-title"

function RfqListSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-[72px] w-full rounded-xl" />
      ))}
    </div>
  )
}

function RfqRow({ rfq, categoryName }: { rfq: RfqRequest; categoryName: string }) {
  return (
    <Link
      to={`/dashboard/rfqs/${rfq.id}`}
      className="border-border bg-card hover:border-primary/40 hover:bg-accent flex items-center justify-between gap-4 rounded-xl border p-4 transition-colors"
    >
      <div className="min-w-0">
        <p className="text-foreground truncate text-sm font-medium">{rfq.title}</p>
        <p className="text-muted-foreground text-xs">
          {categoryName} &middot; {rfq.quantity} {rfq.unit}s &middot;{" "}
          {rfq.responseCount ?? 0} quote{rfq.responseCount === 1 ? "" : "s"}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <RfqStatusBadge status={rfq.status} />
        <ChevronRight className="text-muted-foreground size-4" />
      </div>
    </Link>
  )
}

export function DashboardRfqsPage() {
  useDocumentTitle("RFQs")
  const { data: rfqs, isPending, isError, refetch } = useMyRfqs()
  const { data: categories = [] } = useCategories()
  const [createOpen, setCreateOpen] = useState(false)

  const categoryNameBySlug = new Map(categories.map((c) => [c.id, c.name]))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">RFQs</h1>
          <p className="text-muted-foreground text-sm">
            Post a sourcing need once and compare quotes from every matching supplier.
          </p>
        </div>
        <Button className="gap-2" onClick={() => setCreateOpen(true)}>
          <Plus className="size-4" />
          New RFQ
        </Button>
      </div>

      {isPending ? (
        <RfqListSkeleton />
      ) : isError ? (
        <EmptyState
          icon={AlertTriangle}
          title="Couldn't load your RFQs"
          description="Something went wrong reaching the server."
          actionLabel="Retry"
          onAction={() => refetch()}
        />
      ) : !rfqs || rfqs.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No RFQs yet"
          description="Post a sourcing request and suppliers in that category will be able to quote you directly."
          actionLabel="New RFQ"
          onAction={() => setCreateOpen(true)}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {rfqs.map((rfq) => (
            <RfqRow
              key={rfq.id}
              rfq={rfq}
              categoryName={categoryNameBySlug.get(rfq.categorySlug) ?? rfq.categorySlug}
            />
          ))}
        </div>
      )}

      <CreateRfqDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
