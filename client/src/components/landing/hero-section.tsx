import { useMemo } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowRight, Globe2, ShieldCheck } from "lucide-react"

import { fallbackProducts } from "@/components/landing/fallback-products"
import { HeroFabricTile } from "@/components/landing/hero-fabric-tile"
import { VeyraAiIcon } from "@/components/shared/veyra-ai-icon"
import { Button } from "@/components/ui/button"
import { useFeaturedProducts } from "@/features/marketplace/hooks/use-featured-products"
import type { Product } from "@/features/marketplace/types"

const trustSignals = [
  { icon: VeyraAiIcon, label: "AI-matched instantly" },
  { icon: ShieldCheck, label: "Verified suppliers" },
  { icon: Globe2, label: "Global sourcing network" },
]

interface TileLayout {
  className: string
  rotate: number
  floatDuration: number
}

// Asymmetric, overlapping sample-book arrangement — deliberately not a grid.
const tileLayouts: TileLayout[] = [
  { className: "left-0 top-0 h-[50%] w-[48%]", rotate: -5, floatDuration: 5.2 },
  { className: "right-0 top-6 h-[38%] w-[40%]", rotate: 6, floatDuration: 4.6 },
  { className: "right-4 bottom-0 h-[46%] w-[44%]", rotate: -7, floatDuration: 5.8 },
  { className: "bottom-6 left-10 h-[34%] w-[34%]", rotate: 8, floatDuration: 4.2 },
  { className: "top-[34%] left-[30%] h-[30%] w-[28%]", rotate: -3, floatDuration: 6.4 },
]

function distinctByWeave(products: Product[], count: number): Product[] {
  const seen = new Set<string>()
  const result: Product[] = []
  for (const product of products) {
    if (seen.has(product.fabricType)) continue
    seen.add(product.fabricType)
    result.push(product)
    if (result.length === count) break
  }
  return result
}

export function HeroSection() {
  const { data, isPending } = useFeaturedProducts()

  // Real listings when they exist — elegant fallback samples when they
  // don't, so the hero's centerpiece never depends on the database. Decided
  // once the query settles (isPending gate below) so the five tiles never
  // mount on fallback data and then remount-swap to real data mid-load —
  // that swap replayed every tile's entrance animation as a visible "pop."
  const tileProducts: Product[] = useMemo(() => {
    const real = distinctByWeave(data?.items ?? [], tileLayouts.length)
    if (real.length >= tileLayouts.length) return real
    return fallbackProducts.slice(0, tileLayouts.length)
  }, [data])

  return (
    <section className="relative flex min-h-[calc(100svh-4rem)] items-center overflow-hidden">
      {/* Background: gradient mesh + woven texture — purely decorative */}
      <div
        className="bg-mesh-1 pointer-events-none absolute -top-24 -left-16 -z-10 size-[560px] rounded-full blur-3xl"
        aria-hidden
      />
      <div
        className="bg-mesh-2 pointer-events-none absolute top-24 -right-16 -z-10 size-[480px] rounded-full blur-3xl"
        aria-hidden
      />
      <div
        className="text-foreground pointer-events-none absolute inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, currentColor 0px, currentColor 1px, transparent 1px, transparent 7px)",
        }}
        aria-hidden
      />

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-6 py-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-8">
        {/* Left — text-led */}
        <div className="flex flex-col items-start text-left">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="border-border bg-surface text-muted-foreground mb-6 flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium"
          >
            <VeyraAiIcon className="size-3.5" />
            AI-assisted fabric sourcing
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="font-display text-4xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl"
          >
            Fabric sourcing, <span className="text-primary">powered by AI.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="text-muted-foreground mt-6 max-w-md text-lg text-balance"
          >
            Veyra connects fabric buyers and suppliers on one marketplace —
            natural-language search, instant comparisons, and verified sourcing
            from mills worldwide.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            className="mt-8 flex flex-wrap items-center gap-5 text-xs"
          >
            {trustSignals.map(({ icon: Icon, label }) => (
              <span key={label} className="text-muted-foreground flex items-center gap-1.5">
                <Icon className="text-primary size-3.5" />
                {label}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            className="mt-8 flex flex-col items-start gap-3 sm:flex-row"
          >
            <Button asChild size="lg" className="shadow-primary/25 shadow-lg">
              <Link to="/marketplace">
                Explore marketplace
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/register">Get started free</Link>
            </Button>
          </motion.div>
        </div>

        {/* Right — a luxury sample book of real (or elegant fallback) fabrics */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative h-[440px] sm:h-[500px] lg:h-[540px]"
        >
          {isPending
            ? tileLayouts.map((layout, index) => (
                <div
                  key={index}
                  className={`bg-muted absolute animate-pulse rounded-2xl ${layout.className}`}
                  style={{ zIndex: index }}
                  aria-hidden
                />
              ))
            : tileProducts.map((product, index) => {
                const layout = tileLayouts[index]
                return (
                  <HeroFabricTile
                    key={product.id}
                    product={product}
                    className={`absolute ${layout.className}`}
                    rotate={layout.rotate}
                    floatDuration={layout.floatDuration}
                    floatDelay={index * 0.3}
                    style={{ zIndex: index }}
                  />
                )
              })}
        </motion.div>
      </div>
    </section>
  )
}
