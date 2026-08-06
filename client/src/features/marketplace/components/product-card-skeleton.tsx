import { Skeleton } from "@/components/ui/skeleton"

export function ProductCardSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <div className="border-border/70 bg-card overflow-hidden rounded-2xl border">
      <div className={`relative overflow-hidden ${compact ? "aspect-square" : "aspect-4/5"}`}>
        <Skeleton className="size-full rounded-none" />
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, rgba(0,0,0,0.05) 0px, rgba(0,0,0,0.05) 1px, transparent 1px, transparent 5px)",
          }}
          aria-hidden
        />
      </div>
      <div className="flex flex-col gap-2 p-3.5">
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-4 w-4/5" />
        <div className="mt-1 flex items-end justify-between">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-3 w-8" />
        </div>
      </div>
    </div>
  )
}
