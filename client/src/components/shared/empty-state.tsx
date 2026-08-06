import type { LucideIcon } from "lucide-react"
import { PackageSearch } from "lucide-react"

import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  title: string
  description: string
  icon?: LucideIcon
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({
  title,
  description,
  icon: Icon = PackageSearch,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="border-border flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-20 text-center">
      <Icon className="text-muted-foreground size-8" />
      <h3 className="text-foreground font-medium">{title}</h3>
      <p className="text-muted-foreground max-w-sm text-sm">{description}</p>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction} className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
