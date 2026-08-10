import { Link, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
import { FabricSwatch } from "@/components/shared/fabric-swatch"
import { OrderStatusBadge } from "@/components/shared/order-status-badge"
import { OrderStatusStepper } from "@/components/shared/order-status-stepper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { OrderStatusSelect } from "@/features/supplier/components/order-status-select"
import { useIncomingOrder } from "@/features/supplier/hooks/use-incoming-order"
import { formatPrice } from "@/lib/format"
import { useDocumentTitle } from "@/hooks/use-document-title"

function formatOrderDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function SupplierOrderDetailPage() {
  useDocumentTitle("Order Details")
  const { id } = useParams<{ id: string }>()
  const { data: order, isPending } = useIncomingOrder(id)

  if (isPending) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <Skeleton className="h-64 w-full lg:col-span-2" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <EmptyState
        title="Order not found"
        description="This order may not exist or doesn't contain any of your products."
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          to="/supplier/orders"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm"
        >
          <ArrowLeft className="size-3.5" />
          Back to orders
        </Link>
        <div className="mt-2 flex items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">
            Order #{order.id.slice(-6).toUpperCase()}
          </h1>
          <OrderStatusBadge status={order.status} />
        </div>
        <p className="text-muted-foreground text-sm">
          Placed {formatOrderDate(order.createdAt)}
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <OrderStatusStepper status={order.status} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Your items in this order</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {order.items.map((item) => (
              <div key={item.productId} className="flex gap-3">
                <div className="border-border size-14 shrink-0 overflow-hidden rounded-lg border">
                  <FabricSwatch
                    colorHex={item.colorHex}
                    seed={item.productId}
                    className="size-full"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/products/${item.slug}`}
                    className="text-foreground text-sm font-medium hover:underline"
                  >
                    {item.name}
                  </Link>
                  <p className="text-muted-foreground text-xs">
                    {item.fabricType} &middot; {item.color}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {item.quantity} {item.unit}s &times; {formatPrice(item.pricePerUnit)}
                  </p>
                </div>
                <p className="text-foreground shrink-0 text-sm font-semibold">
                  {formatPrice(item.subtotal)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Update status</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderStatusSelect orderId={order.id} status={order.status} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ship to</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">
              <p className="text-foreground font-medium">{order.shipping.fullName}</p>
              <p>{order.shipping.addressLine1}</p>
              {order.shipping.addressLine2 && <p>{order.shipping.addressLine2}</p>}
              <p>
                {order.shipping.city}, {order.shipping.state} {order.shipping.postalCode}
              </p>
              <p>{order.shipping.country}</p>
              <p className="mt-2">{order.shipping.phone}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-foreground flex items-center justify-between pt-6 text-sm font-semibold">
              <span>Your subtotal</span>
              <span>{formatPrice(order.supplierSubtotal)}</span>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
