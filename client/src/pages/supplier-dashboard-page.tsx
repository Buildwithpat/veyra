import { Link } from "react-router-dom"
import { AlertTriangle, Package, PackageCheck, PackageSearch } from "lucide-react"

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
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { SupplierOrderRow } from "@/features/supplier/components/supplier-order-row"
import { useDashboardStats } from "@/features/supplier/hooks/use-dashboard-stats"
import { useDocumentTitle } from "@/hooks/use-document-title"

export function SupplierDashboardPage() {
  useDocumentTitle("Dashboard")
  const { user } = useAuth()
  const { data: stats, isPending } = useDashboardStats()

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

      <Card>
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
    </div>
  )
}
