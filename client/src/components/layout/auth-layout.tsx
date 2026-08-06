import { Link, Outlet } from "react-router-dom"
import { motion } from "framer-motion"

import { fallbackProducts } from "@/components/landing/fallback-products"
import { VeyraAiIcon } from "@/components/shared/veyra-ai-icon"
import { FabricMaterialCard } from "@/components/shared/fabric-material-card"
import { VeyraMark } from "@/components/shared/veyra-mark"
import { useFeaturedProducts } from "@/features/marketplace/hooks/use-featured-products"

interface TileSlot {
  span: string
  rotate: number
  floatDuration: number
  floatDelay: number
}

// One dominant swatch anchors the composition, four smaller ones surround
// it — an editorial sample-board layout, not a uniform product grid.
const TILE_LAYOUT: TileSlot[] = [
  { span: "col-span-2 row-span-2", rotate: -1.5, floatDuration: 7.5, floatDelay: 0 },
  { span: "col-span-1 row-span-1", rotate: 3, floatDuration: 6, floatDelay: 0.3 },
  { span: "col-span-1 row-span-1", rotate: -2.5, floatDuration: 6.6, floatDelay: 0.6 },
  { span: "col-span-1 row-span-1", rotate: 2, floatDuration: 7, floatDelay: 0.9 },
  { span: "col-span-1 row-span-1", rotate: -3, floatDuration: 6.3, floatDelay: 1.2 },
]

function TileGrid() {
  const { data } = useFeaturedProducts()
  const real = data?.items ?? []
  const tiles = (real.length >= TILE_LAYOUT.length ? real : fallbackProducts).slice(
    0,
    TILE_LAYOUT.length,
  )

  return (
    <div className="grid h-full grid-cols-4 grid-rows-2 gap-3">
      {tiles.map((product, i) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.1 + i * 0.08, ease: "easeOut" }}
          className={TILE_LAYOUT[i]!.span}
        >
          <FabricMaterialCard
            product={product}
            className="size-full"
            rotate={TILE_LAYOUT[i]!.rotate}
            floatDuration={TILE_LAYOUT[i]!.floatDuration}
            floatDelay={TILE_LAYOUT[i]!.floatDelay}
          />
        </motion.div>
      ))}
    </div>
  )
}

export function AuthLayout() {
  return (
    <div className="bg-background h-svh overflow-hidden lg:grid lg:grid-cols-2">
      <div className="flex h-full items-center justify-center overflow-y-auto px-6 py-10 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="w-full max-w-sm"
        >
          <Link to="/" className="mb-10 flex items-center gap-2">
            <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg">
              <VeyraMark className="size-4.5" />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">Veyra</span>
          </Link>
          <Outlet />
        </motion.div>
      </div>

      <div className="border-border/60 bg-surface relative hidden h-full flex-col overflow-hidden border-l px-12 py-12 lg:flex">
        {/* Gradient mesh + faint woven cross-hatch — purely decorative, rhymes with the hero */}
        <div
          className="pointer-events-none absolute inset-0 opacity-80"
          style={{
            background:
              "radial-gradient(55% 45% at 10% 0%, var(--mesh-1), transparent 60%), radial-gradient(50% 45% at 95% 100%, var(--mesh-2), transparent 65%)",
          }}
          aria-hidden
        />
        <div
          className="text-foreground pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, currentColor 0px, currentColor 1px, transparent 1px, transparent 7px)",
          }}
          aria-hidden
        />

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="border-border bg-background/60 text-muted-foreground relative z-10 flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-sm"
        >
          <VeyraAiIcon className="text-primary size-3.5" />
          Real fabrics, real mills
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="font-display text-foreground relative z-10 mt-5 max-w-md text-4xl leading-[1.08] font-semibold text-balance"
        >
          Sourcing, woven <span className="text-primary">into intelligence.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-muted-foreground relative z-10 mt-3 max-w-sm text-sm text-balance"
        >
          Every swatch here is a live listing, not stock art. Sign in to compare specs,
          message verified mills, and let Veyra&apos;s AI match you to the right fabric.
        </motion.p>

        <div className="relative z-10 mt-10 min-h-0 flex-1">
          <TileGrid />
        </div>
      </div>
    </div>
  )
}
