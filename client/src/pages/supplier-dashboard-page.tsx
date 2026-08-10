import { useMemo } from "react"
import { Link } from "react-router-dom"
import {
  AlertTriangle,
  ArrowRight,
  Clock,
  Package,
  PackageCheck,
  PackageSearch,
  Receipt,
  Wallet,
} from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
import { OrderStatusBadge } from "@/components/shared/order-status-badge"
import { StatCard } from "@/components/shared/stat-card"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/features/auth/hooks/use-auth"
import type { OrderStatus } from "@/features/orders/types"
import { IncomingSampleRequestsCard } from "@/features/samples/components/incoming-sample-requests-card"
import { SupplierOrderRow } from "@/features/supplier/components/supplier-order-row"
import { useDashboardStats } from "@/features/supplier/hooks/use-dashboard-stats"
import { useIncomingOrders } from "@/features/supplier/hooks/use-incoming-orders"
import { useDocumentTitle } from "@/hooks/use-document-title"
import { formatPrice } from "@/lib/format"
import { bucketByDay, periodDelta } from "@/lib/trend"

const STATUS_ORDER: OrderStatus[] = [
  "pending",
  "accepted",
  "preparing",
  "ready-for-dispatch",
  "completed",
]

export function SupplierDashboardPage() {
  useDocumentTitle("Dashboard")
  const { user } = useAuth()
  const { data: stats, isPending, isError, refetch } = useDashboardStats()
  const { data: incomingOrders } = useIncomingOrders()

  const businessStats = useMemo(() => {
    const orders = incomingOrders ?? []
    const totalRevenue = orders.reduce((sum, o) => sum + o.supplierSubtotal, 0)
    const pendingOrders = orders.filter((o) => o.status === "pending")
    const avgOrderValue = orders.length ? totalRevenue / orders.length : 0
    const byStatus = STATUS_ORDER.map((status) => ({
      status,
      count: orders.filter((o) => o.status === status).length,
    }))
    const revenuePerDay = bucketByDay(orders, (o) => o.createdAt, 14, (o) => o.supplierSubtotal)
    return {
      totalRevenue,
      pendingOrders: pendingOrders.length,
      avgOrderValue,
      byStatus,
      hasOrders: orders.length > 0,
      revenuePerDay,
      oldestPendingId: pendingOrders[pendingOrders.length - 1]?.id,
    }
  }, [incomingOrders])

  if (isError) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back, {user?.name.split(" ")[0]}
          </h1>
          <p className="text-muted-foreground text-sm">
            Here&apos;s how your business is performing on Veyra.
          </p>
        </div>
        <EmptyState
          icon={AlertTriangle}
          title="Couldn't load your dashboard"
          description="Something went wrong reaching the server."
          actionLabel="Retry"
          onAction={() => refetch()}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome back, {user?.name.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground text-sm">
          Here&apos;s how your business is performing on Veyra.
        </p>
      </div>

      {!isPending && businessStats.pendingOrders > 0 && (
        <Link to="/supplier/orders" className="group">
          <Card className="border-warning/40 bg-warning/5 hover:border-warning/70 transition-colors">
            <CardContent className="flex items-center gap-3 pt-6">
              <div className="bg-warning/15 text-warning flex size-9 shrink-0 items-center justify-center rounded-lg">
                <Clock className="size-4.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-foreground text-sm font-medium">
                  {businessStats.pendingOrders} order{businessStats.pendingOrders === 1 ? "" : "s"} awaiting your response
                </p>
                <p className="text-muted-foreground text-xs">
                  Accept or update status so buyers know where things stand.
                </p>
              </div>
              <ArrowRight className="text-muted-foreground group-hover:text-warning size-4 shrink-0 transition-colors" />
            </CardContent>
          </Card>
        </Link>
      )}

      {isPending ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[104px] rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total products"
            value={stats?.totalProducts ?? 0}
            icon={Package}
          />
          <StatCard
            label="Active products"
            value={stats?.activeProducts ?? 0}
            icon={PackageCheck}
            description="Visible to buyers"
          />
          <StatCard
            label="Inventory alerts"
            value={stats?.inventoryAlerts ?? 0}
            icon={AlertTriangle}
            description="Listings marked limited stock"
          />
          <StatCard
            label="Profile completion"
            value={`${stats?.profileCompletion ?? 0}%`}
            icon={PackageSearch}
          />
        </div>
      )}

      {!isPending && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            label="Total revenue"
            value={formatPrice(businessStats.totalRevenue)}
            icon={Wallet}
            description="Across all orders"
            trend={businessStats.revenuePerDay}
            trendDelta={periodDelta(businessStats.revenuePerDay)}
          />
          <StatCard
            label="Pending orders"
            value={businessStats.pendingOrders}
            icon={Clock}
            description="Awaiting your response"
          />
          <StatCard
            label="Avg. order value"
            value={formatPrice(businessStats.avgOrderValue)}
            icon={Receipt}
          />
        </div>
      )}

      {!isPending && businessStats.hasOrders && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Orders by status</CardTitle>
            <CardDescription>Where your incoming orders currently stand.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {businessStats.byStatus.map(({ status, count }) => (
                <div
                  key={status}
                  className="border-border bg-surface flex flex-1 min-w-[140px] items-center justify-between gap-3 rounded-xl border px-4 py-3"
                >
                  <OrderStatusBadge status={status} />
                  <span className="text-foreground text-lg font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {!isPending && stats && stats.profileCompletion < 100 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Finish your business profile</CardTitle>
            <CardDescription>
              A complete profile builds buyer trust and improves your visibility in
              search.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Progress value={stats.profileCompletion} />
            <Button asChild variant="outline" size="sm" className="w-fit">
              <Link to="/supplier/profile">Complete profile</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Recent orders</CardTitle>
              <CardDescription>Orders containing your products.</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/supplier/orders">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isPending ? (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={i} className="h-[72px] w-full rounded-xl" />
                ))}
              </div>
            ) : !stats || stats.recentOrders.length === 0 ? (
              <EmptyState
                icon={PackageSearch}
                title="No orders yet"
                description="Orders containing your fabrics will show up here."
              />
            ) : (
              <div className="flex flex-col gap-3">
                {stats.recentOrders.map((order) => (
                  <SupplierOrderRow key={order.id} order={order} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <IncomingSampleRequestsCard />
      </div>
    </div>
  )
}
