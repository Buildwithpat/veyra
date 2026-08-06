import { useRef } from "react"
import { motion, useReducedMotion } from "framer-motion"

import { inferWeaveKind, WeaveTexture } from "@/components/shared/weave-texture"
import type { Product } from "@/features/marketplace/types"
import { cn } from "@/lib/utils"

function StitchedEdges() {
  const thread =
    "repeating-linear-gradient(90deg, rgba(255,255,255,0.55) 0px, rgba(255,255,255,0.55) 3px, transparent 3px, transparent 7px)"
  const threadVertical =
    "repeating-linear-gradient(180deg, rgba(255,255,255,0.55) 0px, rgba(255,255,255,0.55) 3px, transparent 3px, transparent 7px)"
  return (
    <div className="pointer-events-none absolute inset-2.5 opacity-40" aria-hidden>
      <div className="absolute top-0 right-0 left-0 h-px" style={{ backgroundImage: thread }} />
      <div className="absolute right-0 bottom-0 left-0 h-px" style={{ backgroundImage: thread }} />
      <div className="absolute top-0 bottom-0 left-0 w-px" style={{ backgroundImage: threadVertical }} />
      <div className="absolute top-0 right-0 bottom-0 w-px" style={{ backgroundImage: threadVertical }} />
    </div>
  )
}

interface HeroFabricTileProps {
  product: Product
  className?: string
  rotate?: number
  style?: React.CSSProperties
  floatDuration?: number
  floatDelay?: number
}

/**
 * A real (or elegant fallback) fabric rendered as a tactile swatch — woven
 * texture, stitched edges, fiber grain. Reacts only to its own hover: lifts
 * slightly and reveals its material spec — no drag, no shared motion with
 * neighboring tiles.
 */
export function HeroFabricTile({
  product,
  className,
  rotate = 0,
  style,
  floatDuration,
  floatDelay = 0,
}: HeroFabricTileProps) {
  const tileRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const idle = floatDuration && !shouldReduceMotion
  const weaveKind = inferWeaveKind(product.fabricType, product.tags)

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const bounds = tileRef.current?.getBoundingClientRect()
    if (!bounds) return
    const px = ((e.clientX - bounds.left) / bounds.width) * 100
    const py = ((e.clientY - bounds.top) / bounds.height) * 100
    tileRef.current?.style.setProperty("--lx", `${px}%`)
    tileRef.current?.style.setProperty("--ly", `${py}%`)
  }

  return (
    <motion.div
      ref={tileRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "group border-border/70 relative overflow-hidden rounded-2xl border shadow-[0_18px_40px_-16px_rgba(35,22,10,0.3)]",
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
        scale: 1.04,
        transition: { type: "spring", stiffness: 260, damping: 20 },
      }}
    >
      <WeaveTexture kind={weaveKind} colorHex={product.colorHex} seed={product.id} />
      <StitchedEdges />

      {/* Light that follows the cursor across the fibers, only on this tile */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(180px circle at var(--lx, 50%) var(--ly, 50%), rgba(255,255,255,0.35), transparent 60%)",
        }}
      />

      {/* White text over an arbitrary swatch color — a token color can't
          guarantee contrast here, so this is a deliberate exception. */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-3 pt-10 transition-colors duration-300 group-hover:from-black/90">
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
