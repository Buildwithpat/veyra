import { AnimatePresence, motion } from "framer-motion"
import { Check, Loader2 } from "lucide-react"

import { VeyraMark } from "@/components/shared/veyra-mark"
import { cn } from "@/lib/utils"

export interface AppShellStep {
  label: string
  done: boolean
}

interface AppShellLoaderProps {
  steps: AppShellStep[]
  visible: boolean
}

/**
 * First-paint app shell loader. Mounted alongside the real app (see
 * AppShell) so the page underneath is already rendered and painted before
 * this fades out — the reveal is a pure opacity crossfade, never a mount.
 */
export function AppShellLoader({ steps, visible }: AppShellLoaderProps) {
  const activeIndex = steps.findIndex((step) => !step.done)

  return (
    <div
      className={cn(
        "bg-background fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-500 ease-out",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      aria-hidden={!visible}
    >
      {/* Woven cross-hatch texture, decorative only */}
      <div
        className="text-foreground pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, currentColor 0px, currentColor 1px, transparent 1px, transparent 7px), repeating-linear-gradient(-45deg, currentColor 0px, currentColor 1px, transparent 1px, transparent 7px)",
        }}
        aria-hidden
      />
      <div
        className="bg-mesh-1 pointer-events-none absolute top-1/2 left-1/2 size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        aria-hidden
      />

      <div className="relative flex flex-col items-center">
        <div className="relative mb-6">
          <span
            className="bg-primary/25 absolute inset-0 -z-10 animate-ping rounded-2xl"
            style={{ animationDuration: "2.4s" }}
            aria-hidden
          />
          <span className="bg-primary text-primary-foreground shadow-primary/25 relative flex size-14 items-center justify-center rounded-2xl shadow-lg">
            <VeyraMark className="size-7" />
          </span>
        </div>

        <span className="font-display text-2xl font-semibold tracking-tight">Veyra</span>
        <span className="text-muted-foreground mt-1 text-[11px] tracking-[0.2em] uppercase">
          Modern Textile Commerce
        </span>

        <ul className="mt-10 flex flex-col gap-3">
          {steps.map((step, index) => {
            const isDone = step.done
            const isActive = index === activeIndex
            return (
              <li key={step.label} className="flex items-center gap-2.5 text-sm">
                <span className="relative flex size-4 items-center justify-center">
                  <AnimatePresence mode="wait" initial={false}>
                    {isDone ? (
                      <motion.span
                        key="done"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="text-primary flex items-center justify-center"
                      >
                        <Check className="size-4" strokeWidth={2.5} />
                      </motion.span>
                    ) : isActive ? (
                      <motion.span
                        key="active"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-muted-foreground flex items-center justify-center"
                      >
                        <Loader2 className="size-4 animate-spin" />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="pending"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-border block size-1.5 rounded-full border"
                      />
                    )}
                  </AnimatePresence>
                </span>
                <span
                  className={cn(
                    "transition-colors duration-300",
                    isDone || isActive ? "text-foreground" : "text-muted-foreground/60",
                  )}
                >
                  {step.label}
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
