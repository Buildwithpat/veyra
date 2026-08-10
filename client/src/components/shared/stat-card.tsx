import type { LucideIcon } from "lucide-react"
import { TrendingDown, TrendingUp } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  description?: string
  /** Daily bucketed values (oldest first) for a small activity sparkline. Omit to render no chart. */
  trend?: number[]
  /** % change vs. the prior period, e.g. from `periodDelta()`. Omit to render no delta. */
  trendDelta?: number | null
}

function Sparkline({ values }: { values: number[] }) {
  const width = 64
  const height = 20
  const max = Math.max(...values, 1)
  const step = width / Math.max(values.length - 1, 1)

  const points = values
    .map((v, i) => `${i * step},${height - (v / max) * (height - 2) - 1}`)
    .join(" ")

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="text-primary/70 shrink-0" aria-hidden>
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function StatCard({ label, value, icon: Icon, description, trend, trendDelta }: StatCardProps) {
  const hasTrend = trend && trend.length >= 2
  const showDelta = typeof trendDelta === "number"

  return (
    <Card>
      <CardContent className="flex items-start justify-between pt-6">
        <div>
          <p className="text-muted-foreground text-sm">{label}</p>
          <p className="text-foreground mt-1 text-2xl font-semibold">{value}</p>
          {description && (
            <p className="text-muted-foreground mt-1 text-xs">{description}</p>
          )}
          {showDelta && (
            <p
              className={cn(
                "mt-1.5 flex items-center gap-1 text-xs font-medium",
                trendDelta! > 0 && "text-success",
                trendDelta! < 0 && "text-destructive",
                trendDelta === 0 && "text-muted-foreground",
              )}
            >
              {trendDelta! > 0 ? (
                <TrendingUp className="size-3" />
              ) : trendDelta! < 0 ? (
                <TrendingDown className="size-3" />
              ) : null}
              {trendDelta! > 0 ? "+" : ""}
              {trendDelta}% vs. prior period
            </p>
          )}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-lg">
            <Icon className="size-4.5" />
          </div>
          {hasTrend && <Sparkline values={trend} />}
        </div>
      </CardContent>
    </Card>
  )
}
