import { OrderSummaryRow } from "@/components/shared/order-summary-row"
import type { Order } from "@/features/orders/types"

export function OrderRow({ order }: { order: Order }) {
  return (
    <OrderSummaryRow
      id={order.id}
      to={`/dashboard/orders/${order.id}`}
      createdAt={order.createdAt}
      itemCount={order.items.length}
      total={order.total}
      status={order.status}
    />
  )
}
