import { PackageSearch } from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { SampleRequestStatusBadge } from "@/features/samples/components/sample-request-status-badge"
import { useIncomingSampleRequests } from "@/features/samples/hooks/use-sample-requests"
import { useUpdateSampleRequestStatus } from "@/features/samples/hooks/use-update-sample-request-status"

export function IncomingSampleRequestsCard() {
  const { data: sampleRequests, isPending } = useIncomingSampleRequests()
  const updateStatus = useUpdateSampleRequestStatus()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Sample requests</CardTitle>
        <CardDescription>Buyers who want a swatch before ordering.</CardDescription>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-[88px] w-full rounded-xl" />
            ))}
          </div>
        ) : !sampleRequests || sampleRequests.length === 0 ? (
          <EmptyState
            icon={PackageSearch}
            title="No sample requests yet"
            description="Requests for physical swatches will show up here."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {sampleRequests.map((request) => (
              <div
                key={request.id}
                className="border-border bg-surface flex flex-col gap-3 rounded-xl border p-4"
              >
                <div className="flex items-start justify-between gap-3">
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
                        {request.fabricType} &middot; {request.color}
                      </p>
                    </div>
                  </div>
                  <SampleRequestStatusBadge status={request.status} />
                </div>

                {request.note && (
                  <p className="text-muted-foreground bg-background rounded-lg border border-border/70 p-2.5 text-xs">
                    &ldquo;{request.note}&rdquo;
                  </p>
                )}

                {request.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      disabled={updateStatus.isPending}
                      onClick={() =>
                        updateStatus.mutate({ id: request.id, status: "approved" })
                      }
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      disabled={updateStatus.isPending}
                      onClick={() =>
                        updateStatus.mutate({ id: request.id, status: "declined" })
                      }
                    >
                      Decline
                    </Button>
                  </div>
                )}

                {request.status === "approved" && (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={updateStatus.isPending}
                    onClick={() =>
                      updateStatus.mutate({ id: request.id, status: "shipped" })
                    }
                  >
                    Mark shipped
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
