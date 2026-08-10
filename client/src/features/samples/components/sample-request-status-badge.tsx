import { Badge } from "@/components/ui/badge"
import type { SampleRequestStatus } from "@/features/samples/types"

const config: Record<
  SampleRequestStatus,
  {
    label: string
    variant: "success" | "warning" | "secondary" | "destructive" | "outline"
  }
> = {
  pending: { label: "Pending", variant: "outline" },
  approved: { label: "Approved", variant: "secondary" },
  shipped: { label: "Shipped", variant: "success" },
  declined: { label: "Declined", variant: "destructive" },
}

export function SampleRequestStatusBadge({ status }: { status: SampleRequestStatus }) {
  const { label, variant } = config[status]
  return <Badge variant={variant}>{label}</Badge>
}
