import { PackageSearch } from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { SampleRequestStatusBadge } from "@/features/samples/components/sample-request-status-badge"
import { useMySampleRequests } from "@/features/samples/hooks/use-sample-requests"

export function MySampleRequestsCard() {
  const { data: sampleRequests, isPending } = useMySampleRequests()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Sample requests</CardTitle>
        <CardDescription>Swatches you&apos;ve requested from suppliers.</CardDescription>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-[72px] w-full rounded-xl" />
            ))}
          </div>
        ) : !sampleRequests || sampleRequests.length === 0 ? (
          <EmptyState
            icon={PackageSearch}
            title="No sample requests yet"
            description="Request a physical swatch from a product page before ordering."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {sampleRequests.map((request) => (
              <div
                key={request.id}
                className="border-border bg-surface flex items-center justify-between gap-3 rounded-xl border p-4"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="border-border size-6 shrink-0 rounded-full border"
                    style={{ backgroundColor: request.colorHex }}
                  />
                  <div>
                    <p className="text-foreground text-sm font-medium">
                      {request.productName}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {request.supplierName} &middot; {request.fabricType}
                    </p>
                  </div>
                </div>
                <SampleRequestStatusBadge status={request.status} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
