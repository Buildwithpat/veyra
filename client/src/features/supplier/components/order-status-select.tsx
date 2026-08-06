import { toast } from "sonner"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { OrderStatus } from "@/features/orders/types"
import { useUpdateOrderStatus } from "@/features/supplier/hooks/use-update-order-status"

const statusOptions: Array<{ value: OrderStatus; label: string }> = [
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "preparing", label: "Preparing" },
  { value: "ready-for-dispatch", label: "Ready for dispatch" },
  { value: "completed", label: "Completed" },
]

export function OrderStatusSelect({
  orderId,
  status,
}: {
  orderId: string
  status: OrderStatus
}) {
  const updateStatus = useUpdateOrderStatus()
  const currentIndex = statusOptions.findIndex((option) => option.value === status)

  function handleChange(value: string) {
    updateStatus.mutate(
      { id: orderId, status: value as OrderStatus },
      {
        onSuccess: () => toast.success("Order status updated"),
        onError: () => toast.error("Could not update order status. Try again."),
      },
    )
  }

  return (
    <Select value={status} onValueChange={handleChange} disabled={updateStatus.isPending}>
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((option, index) => (
          <SelectItem
            key={option.value}
            value={option.value}
            disabled={index < currentIndex}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
