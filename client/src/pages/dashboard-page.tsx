import { useMemo } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  AlertTriangle,
  ArrowUpRight,
  Building2,
  PackageSearch,
  ShoppingBag,
  Sparkles,
  Truck,
  Wallet,
} from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
import { StatCard } from "@/components/shared/stat-card"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { useAssistantPanel } from "@/features/assistant/hooks/use-assistant-panel"
import { OrderRow } from "@/features/orders/components/order-row"
import { useOrders } from "@/features/orders/hooks/use-orders"
import { MySampleRequestsCard } from "@/features/samples/components/my-sample-requests-card"
import { useDocumentTitle } from "@/hooks/use-document-title"
import { formatPrice } from "@/lib/format"
import { bucketByDay, periodDelta } from "@/lib/trend"

const quickActions = [
  {
    icon: ShoppingBag,
    label: "Browse marketplace",
    description: "Discover verified fabrics",
    to: "/marketplace",
  },
  {
    icon: PackageSearch,
    label: "Track orders",
    description: "See status & history",
    to: "/dashboard/orders",
  },
]

export function DashboardPage() {
  useDocumentTitle("Dashboard")
  const { user } = useAuth()
  const { data: orders, isPending, isError, refetch } = useOrders()
  const { openAssistant } = useAssistantPanel()
  const navigate = useNavigate()

  const recentOrders = (orders ?? []).slice(0, 3)

  const stats = useMemo(() => {
    const all = orders ?? []
    const activeOrders = all.filter((o) => o.status !== "completed")
    const totalSpent = all.reduce((sum, o) => sum + o.total, 0)
    const supplierIds = new Set(all.flatMap((o) => o.items.map((item) => item.supplierId)))
    const ordersPerDay = bucketByDay(all, (o) => o.createdAt, 14)
    const spendPerDay = bucketByDay(all, (o) => o.createdAt, 14, (o) => o.total)
    return {
      totalOrders: all.length,
      activeOrders: activeOrders.length,
      totalSpent,
      supplierCount: supplierIds.size,
      ordersPerDay,
      spendPerDay,
    }
  }, [orders])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome back, {user?.name.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground text-sm">
          Here&apos;s what&apos;s happening with your account.
        </p>
      </div>

      {isPending ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[104px] rounded-xl" />
          ))}
        </div>
      ) : !isError ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total orders"
            value={stats.totalOrders}
            icon={ShoppingBag}
            trend={stats.ordersPerDay}
            trendDelta={periodDelta(stats.ordersPerDay)}
          />
          <StatCard
            label="Active orders"
            value={stats.activeOrders}
            icon={Truck}
            description="In progress with suppliers"
          />
          <StatCard
            label="Total spent"
            value={formatPrice(stats.totalSpent)}
            icon={Wallet}
            trend={stats.spendPerDay}
            trendDelta={periodDelta(stats.spendPerDay)}
          />
          <StatCard
            label="Suppliers sourced from"
            value={stats.supplierCount}
            icon={Building2}
          />
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {quickActions.map(({ icon: Icon, label, description, to }) => (
          <Link key={to} to={to} className="group">
            <Card className="hover:border-primary/40 h-full transition-colors">
              <CardContent className="flex items-center gap-3 pt-6">
                <div className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg">
                  <Icon className="size-4.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-foreground text-sm font-medium">{label}</p>
                  <p className="text-muted-foreground truncate text-xs">{description}</p>
                </div>
                <ArrowUpRight className="text-muted-foreground group-hover:text-primary size-4 shrink-0 transition-colors" />
              </CardContent>
            </Card>
          </Link>
        ))}
        <button type="button" onClick={() => openAssistant()} className="group text-left">
          <Card className="hover:border-primary/40 h-full transition-colors">
            <CardContent className="flex items-center gap-3 pt-6">
              <div className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg">
                <Sparkles className="size-4.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-foreground text-sm font-medium">Ask Veyra AI</p>
                <p className="text-muted-foreground truncate text-xs">
                  Get fabric recommendations
                </p>
              </div>
              <ArrowUpRight className="text-muted-foreground group-hover:text-primary size-4 shrink-0 transition-colors" />
            </CardContent>
          </Card>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Recent orders</CardTitle>
              <CardDescription>Your most recently placed orders.</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/dashboard/orders">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isPending ? (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={i} className="h-[72px] w-full rounded-xl" />
                ))}
              </div>
            ) : isError ? (
              <EmptyState
                icon={AlertTriangle}
                title="Couldn't load your orders"
                description="Something went wrong reaching the server."
                actionLabel="Retry"
                onAction={() => refetch()}
              />
            ) : recentOrders.length === 0 ? (
              <EmptyState
                icon={PackageSearch}
                title="No orders yet"
                description="Fabrics you order will show up here."
                actionLabel="Browse marketplace"
                onAction={() => navigate("/marketplace")}
              />
            ) : (
              <div className="flex flex-col gap-3">
                {recentOrders.map((order) => (
                  <OrderRow key={order.id} order={order} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <MySampleRequestsCard />
      </div>
    </div>
  )
}
