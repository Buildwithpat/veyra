import type { LucideIcon } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  description?: string
}

export function StatCard({ label, value, icon: Icon, description }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between pt-6">
        <div>
          <p className="text-muted-foreground text-sm">{label}</p>
          <p className="text-foreground mt-1 text-2xl font-semibold">{value}</p>
          {description && (
            <p className="text-muted-foreground mt-1 text-xs">{description}</p>
          )}
        </div>
        <div className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg">
          <Icon className="size-4.5" />
        </div>
      </CardContent>
    </Card>
  )
}
