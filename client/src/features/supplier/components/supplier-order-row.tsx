import { OrderSummaryRow } from "@/components/shared/order-summary-row"
import type { SupplierOrder } from "@/features/orders/types"

export function SupplierOrderRow({ order }: { order: SupplierOrder }) {
  return (
    <OrderSummaryRow
      id={order.id}
      to={`/supplier/orders/${order.id}`}
      createdAt={order.createdAt}
      itemCount={order.items.length}
      total={order.supplierSubtotal}
      status={order.status}
    />
  )
}
