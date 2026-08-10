import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { useCreateOrder } from "@/features/orders/hooks/use-create-order"
import type { Order } from "@/features/orders/types"
import { getErrorMessage } from "@/lib/errors"

export function useReorder() {
  const navigate = useNavigate()
  const createOrder = useCreateOrder()

  function reorder(order: Order) {
    createOrder.mutate(
      { items: order.items, shipping: order.shipping },
      {
        onSuccess: (newOrder) => {
          toast.success("Reordered — a new order has been placed")
          navigate(`/dashboard/orders/${newOrder.id}`)
        },
        onError: (error) => {
          toast.error(
            getErrorMessage(error, "Couldn't reorder — some items may no longer be available"),
          )
        },
      },
    )
  }

  return { reorder, isReordering: createOrder.isPending }
}
