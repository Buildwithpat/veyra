import { AlertTriangle, PackageSearch } from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OrderRow } from "@/features/orders/components/order-row"
import { useOrders } from "@/features/orders/hooks/use-orders"
import type { Order } from "@/features/orders/types"
import { useDocumentTitle } from "@/hooks/use-document-title"

function isCurrent(order: Order) {
  return order.status !== "completed"
}

function OrderListSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-[72px] w-full rounded-xl" />
      ))}
    </div>
  )
}

export function DashboardOrdersPage() {
  useDocumentTitle("My Orders")
  const { data: orders, isPending, isError, refetch } = useOrders()

  const current = (orders ?? []).filter(isCurrent)
  const history = (orders ?? []).filter((o) => !isCurrent(o))

  const errorState = (
    <EmptyState
      icon={AlertTriangle}
      title="Couldn't load your orders"
      description="Something went wrong reaching the server."
      actionLabel="Retry"
      onAction={() => refetch()}
    />
  )

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
        <p className="text-muted-foreground text-sm">
          Track your current and past orders.
        </p>
      </div>

      <Tabs defaultValue="current">
        <TabsList>
          <TabsTrigger value="current">Current</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="mt-6">
          {isPending ? (
            <OrderListSkeleton />
          ) : isError ? (
            errorState
          ) : current.length === 0 ? (
            <EmptyState
              icon={PackageSearch}
              title="No current orders"
              description="Orders you place will show up here while they're in progress."
            />
          ) : (
            <div className="flex flex-col gap-3">
              {current.map((order) => (
                <OrderRow key={order.id} order={order} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          {isPending ? (
            <OrderListSkeleton />
          ) : isError ? (
            errorState
          ) : history.length === 0 ? (
            <EmptyState
              icon={PackageSearch}
              title="No order history yet"
              description="Completed orders will appear here."
            />
          ) : (
            <div className="flex flex-col gap-3">
              {history.map((order) => (
                <OrderRow key={order.id} order={order} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
