import { cn } from "@/lib/utils"

/**
 * Veyra's brand mark — three interwoven threads converging to a point,
 * evoking a loom's warp threads and a stylized "V." Single-color,
 * currentColor-driven so it inherits text/icon color like a lucide icon.
 */
export function VeyraMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("size-4", className)}
      aria-hidden="true"
    >
      <path
        d="M4 5c4 1.5 4.5 9 8 14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 4c-1.8 4.5 -1.8 9.5 0 14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M20 5c-4 1.5 -4.5 9 -8 14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}
