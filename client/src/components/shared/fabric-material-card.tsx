import { motion, useReducedMotion, type MotionStyle } from "framer-motion"

import { FabricSwatch } from "@/components/shared/fabric-swatch"
import type { Product } from "@/features/marketplace/types"
import { cn } from "@/lib/utils"

interface FabricMaterialCardProps {
  product: Product
  className?: string
  rotate?: number
  style?: MotionStyle
  /** Idle float loop — omit for a static card (e.g. in a grid). */
  floatDuration?: number
  floatDelay?: number
}

/**
 * A real marketplace fabric rendered as a tactile material swatch — woven
 * texture, GSM, weave and supplier country — not a stock photograph. Hover
 * lifts and tilts the card and reveals the detail lines instead of just
 * scaling, so the texture itself stays the focal point.
 */
export function FabricMaterialCard({
  product,
  className,
  rotate = 0,
  style,
  floatDuration,
  floatDelay = 0,
}: FabricMaterialCardProps) {
  const shouldReduceMotion = useReducedMotion()
  const idle = floatDuration && !shouldReduceMotion

  return (
    <motion.div
      className={cn(
        "group border-border/70 relative overflow-hidden rounded-2xl border shadow-[0_18px_40px_-16px_rgba(35,22,10,0.28)]",
        className,
      )}
      style={{ rotate, ...style }}
      animate={
        idle
          ? {
              y: [0, -8, 0],
              transition: {
                duration: floatDuration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: floatDelay,
              },
            }
          : undefined
      }
      whileHover={{
        y: -10,
        rotate: rotate + (rotate >= 0 ? 3 : -3),
        scale: 1.03,
        transition: { type: "spring", stiffness: 260, damping: 20 },
      }}
    >
      <FabricSwatch colorHex={product.colorHex} seed={product.id} className="size-full" />

      {/* Folded-corner accent — rhymes with the hero's peel swatches */}
      <div className="absolute top-0 right-0 size-6" aria-hidden>
        <div
          className="bg-background/70 size-full shadow-[0_2px_4px_rgba(35,22,10,0.12)]"
          style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
        />
      </div>

      {/* White text over an arbitrary swatch color — a token color can't
          guarantee contrast here, so this is a deliberate exception. */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent p-3 pt-9 transition-colors duration-300 group-hover:from-black/90">
        <p className="truncate text-sm font-semibold text-white">{product.name}</p>
        <p className="mt-0.5 truncate text-[11px] text-white/0 transition-colors duration-200 group-hover:text-white/80">
          {product.composition}
        </p>
        <div className="mt-1 flex items-center justify-between text-[10px] text-white/0 transition-colors delay-75 duration-200 group-hover:text-white/70">
          <span>
            {product.fabricType} · {product.weightGsm} gsm
          </span>
          <span>{product.supplier.country}</span>
        </div>
      </div>
    </motion.div>
  )
}
