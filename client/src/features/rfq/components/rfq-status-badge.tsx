import { Badge } from "@/components/ui/badge"
import type { RfqStatus } from "@/features/rfq/types"

const config: Record<
  RfqStatus,
  { label: string; variant: "success" | "warning" | "secondary" | "outline" }
> = {
  open: { label: "Open", variant: "warning" },
  awarded: { label: "Awarded", variant: "success" },
  closed: { label: "Closed", variant: "outline" },
}

export function RfqStatusBadge({ status }: { status: RfqStatus }) {
  const { label, variant } = config[status]
  return <Badge variant={variant}>{label}</Badge>
}
