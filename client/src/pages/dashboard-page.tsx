import { Link, useNavigate } from "react-router-dom"
import { PackageSearch } from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
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
import { OrderRow } from "@/features/orders/components/order-row"
import { useOrders } from "@/features/orders/hooks/use-orders"
import { useDocumentTitle } from "@/hooks/use-document-title"

export function DashboardPage() {
  useDocumentTitle("Dashboard")
  const { user } = useAuth()
  const { data: orders, isPending } = useOrders()
  const navigate = useNavigate()
  const recentOrders = (orders ?? []).slice(0, 3)

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

      <Card>
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
    </div>
  )
}
