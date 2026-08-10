import { Check } from "lucide-react"

import type { OrderStatus } from "@/features/orders/types"
import { cn } from "@/lib/utils"

const STEPS: { status: OrderStatus; label: string }[] = [
  { status: "pending", label: "Placed" },
  { status: "accepted", label: "Accepted" },
  { status: "preparing", label: "Preparing" },
  { status: "ready-for-dispatch", label: "Ready for dispatch" },
  { status: "completed", label: "Completed" },
]

export function OrderStatusStepper({ status }: { status: OrderStatus }) {
  const currentIndex = STEPS.findIndex((step) => step.status === status)

  return (
    <div className="flex items-start">
      {STEPS.map((step, index) => {
        const isDone = index < currentIndex
        const isCurrent = index === currentIndex
        const isLast = index === STEPS.length - 1

        return (
          <div key={step.status} className={cn("flex items-start", !isLast && "flex-1")}>
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium transition-colors",
                  isDone && "border-primary bg-primary text-primary-foreground",
                  isCurrent && "border-primary text-primary",
                  !isDone && !isCurrent && "border-border text-muted-foreground",
                )}
              >
                {isDone ? <Check className="size-3.5" /> : index + 1}
              </div>
              <span
                className={cn(
                  "mt-1.5 max-w-[5.5rem] text-center text-[11px] leading-tight",
                  isCurrent ? "text-foreground font-medium" : "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div
                className={cn(
                  "mt-3.5 h-px flex-1",
                  isDone ? "bg-primary" : "bg-border",
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
