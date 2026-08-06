import { Link } from "react-router-dom"
import { ChevronRight } from "lucide-react"

import { OrderStatusBadge } from "@/components/shared/order-status-badge"
import type { OrderStatus } from "@/features/orders/types"
import { formatPrice } from "@/lib/format"

interface OrderSummaryRowProps {
  id: string
  to: string
  createdAt: string
  itemCount: number
  total: number
  status: OrderStatus
}

function formatOrderDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function OrderSummaryRow({
  id,
  to,
  createdAt,
  itemCount,
  total,
  status,
}: OrderSummaryRowProps) {
  return (
    <Link
      to={to}
      className="border-border bg-card hover:border-primary/40 hover:bg-accent flex items-center justify-between gap-4 rounded-xl border p-4 transition-colors"
    >
      <div className="min-w-0">
        <p className="text-foreground truncate text-sm font-medium">
          Order #{id.slice(-6).toUpperCase()}
        </p>
        <p className="text-muted-foreground text-xs">
          {formatOrderDate(createdAt)} &middot; {itemCount} item
          {itemCount !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <p className="text-foreground text-sm font-semibold">{formatPrice(total)}</p>
        <OrderStatusBadge status={status} />
        <ChevronRight className="text-muted-foreground size-4" />
      </div>
    </Link>
  )
}
