import { Badge } from "@/components/ui/badge"
import type { Availability } from "@/features/marketplace/types"

const config: Record<
  Availability,
  { label: string; variant: "success" | "warning" | "secondary" }
> = {
  "in-stock": { label: "In stock", variant: "success" },
  limited: { label: "Limited stock", variant: "warning" },
  "made-to-order": { label: "Made to order", variant: "secondary" },
}

export function AvailabilityBadge({ availability }: { availability: Availability }) {
  const { label, variant } = config[availability]
  return <Badge variant={variant}>{label}</Badge>
}
