import { PackageSearch } from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
import { Skeleton } from "@/components/ui/skeleton"
import { SupplierOrderRow } from "@/features/supplier/components/supplier-order-row"
import { useIncomingOrders } from "@/features/supplier/hooks/use-incoming-orders"
import { useDocumentTitle } from "@/hooks/use-document-title"

export function SupplierOrdersPage() {
  useDocumentTitle("Incoming Orders")
  const { data: orders, isPending } = useIncomingOrders()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
        <p className="text-muted-foreground text-sm">
          Orders from buyers containing your products.
        </p>
      </div>

      {isPending ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[72px] w-full rounded-xl" />
          ))}
        </div>
      ) : !orders || orders.length === 0 ? (
        <EmptyState
          icon={PackageSearch}
          title="No orders yet"
          description="Orders containing your fabrics will show up here."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <SupplierOrderRow key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}
