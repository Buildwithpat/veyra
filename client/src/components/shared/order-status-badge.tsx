import { Badge } from "@/components/ui/badge"
import type { OrderStatus } from "@/features/orders/types"

const config: Record<
  OrderStatus,
  {
    label: string
    variant: "success" | "warning" | "secondary" | "destructive" | "outline"
  }
> = {
  pending: { label: "Pending", variant: "outline" },
  accepted: { label: "Accepted", variant: "secondary" },
  preparing: { label: "Preparing", variant: "secondary" },
  "ready-for-dispatch": { label: "Ready for dispatch", variant: "warning" },
  completed: { label: "Completed", variant: "success" },
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { label, variant } = config[status]
  return <Badge variant={variant}>{label}</Badge>
}
