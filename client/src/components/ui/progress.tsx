import { cn } from "@/lib/utils"

interface ProgressProps {
  value: number
  className?: string
}

function Progress({ value, className }: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("bg-muted h-2 w-full overflow-hidden rounded-full", className)}
    >
      <div
        className="bg-primary h-full rounded-full transition-[width] duration-300 ease-out"
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}

export { Progress }
