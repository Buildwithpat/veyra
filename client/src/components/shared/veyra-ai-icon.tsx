import { cn } from "@/lib/utils"

/**
 * Veyra AI's icon — a soft six-ray spark with curved, thread-like rays
 * instead of straight sparkle points, tying the assistant's mark back to
 * the brand's weaving motif. Used everywhere the app refers specifically
 * to the AI assistant (trigger, panel header, message avatar, insight
 * cards) — not a general-purpose "sparkle" icon.
 */
export function VeyraAiIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("size-4", className)}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="2.1" fill="currentColor" />
      <path d="M12.6 9.2c.6-2.4.9-3.1 2.4-4.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14.8 12.6c2.4.6 3.1.9 4.6 2.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14.8 11.4c2.4-.6 3.1-.9 4.6-2.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12.6 14.8c.6 2.4.9 3.1 2.4 4.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9.2 11.4c-2.4-.6-3.1-.9-4.6-2.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9.4 12.6c-2.4.6-3.1.9-4.6 2.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
