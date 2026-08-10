import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

import { FadeIn } from "@/components/shared/fade-in"
import { SectionHeading } from "@/components/shared/section-heading"
import { VeyraMark } from "@/components/shared/veyra-mark"

/**
 * A network graph, not a map — sourcing regions as connected nodes around
 * Veyra's AI hub. Node positions are fixed (computed once, never rotate).
 */
interface RegionNode {
  flag: string
  name: string
  specialty: string
  description: string
  popularProducts: string[]
  categories: string[]
}

const regions: RegionNode[] = [
  {
    flag: "🇮🇳",
    name: "India",
    specialty: "Cotton & Handloom",
    description:
      "One of the world's largest cotton producers, with deep handloom weaving traditions.",
    popularProducts: ["Cotton Poplin", "Handloom Cotton", "Khadi"],
    categories: ["Cotton", "Sustainable", "Handloom"],
  },
  {
    flag: "🇨🇳",
    name: "China",
    specialty: "Synthetics & Technical",
    description:
      "Large-scale production spanning synthetics, blends and technical performance textiles.",
    popularProducts: ["Polyester Blends", "Technical Knits", "Performance Wovens"],
    categories: ["Synthetics", "Technical", "Knits"],
  },
  {
    flag: "🇻🇳",
    name: "Vietnam",
    specialty: "Knits & Garment Fabrics",
    description: "A rapidly expanding knitwear and garment-fabric manufacturing base.",
    popularProducts: ["Cotton Jersey", "Rib Knit", "Poly-Cotton Blends"],
    categories: ["Knits", "Garment Fabrics"],
  },
  {
    flag: "🇧🇩",
    name: "Bangladesh",
    specialty: "Sustainable Textiles",
    description: "A fast-growing hub for certified sustainable, garment-grade fabrics.",
    popularProducts: ["Organic Cotton Jersey", "Recycled Polyester", "Cotton Twill"],
    categories: ["Sustainable", "Knits", "Garment-grade"],
  },
  {
    flag: "🇹🇷",
    name: "Turkey",
    specialty: "Denim & Cotton",
    description: "A major denim and cotton-blend manufacturing hub bridging Europe and Asia.",
    popularProducts: ["Selvedge Denim", "Stretch Denim", "Cotton Twill"],
    categories: ["Denim", "Cotton Blends"],
  },
  {
    flag: "🇮🇹",
    name: "Italy",
    specialty: "Silk & Fine Wool",
    description: "Renowned ateliers producing luxury silk, wool and tailoring fabrics.",
    popularProducts: ["Silk Charmeuse", "Merino Flannel", "Jacquard Brocade"],
    categories: ["Silk", "Wool", "Jacquard"],
  },
  {
    flag: "🇵🇹",
    name: "Portugal",
    specialty: "Linen & Knitwear",
    description: "Boutique European mills specializing in linen and premium knitwear.",
    popularProducts: ["Belgian-style Linen", "Cotton Rib Knit", "Merino Knitwear"],
    categories: ["Linen", "Knitwear"],
  },
]

const SIZE = 800
const CENTER = { x: SIZE / 2, y: SIZE / 2 }
const RADIUS = 300

const nodePositions = regions.map((_, index) => {
  const angle = -90 + index * (360 / regions.length)
  const rad = (angle * Math.PI) / 180
  return {
    x: CENTER.x + RADIUS * Math.cos(rad),
    y: CENTER.y + RADIUS * Math.sin(rad),
  }
})

// Secondary web connections between related sourcing regions, by name.
const secondaryEdges: [string, string][] = [
  ["India", "Bangladesh"],
  ["Turkey", "Italy"],
  ["Italy", "Portugal"],
  ["China", "Vietnam"],
  ["Turkey", "China"],
]

function curvedPath(x1: number, y1: number, x2: number, y2: number, bow: number) {
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  const dx = x2 - x1
  const dy = y2 - y1
  const dist = Math.hypot(dx, dy) || 1
  const nx = -dy / dist
  const ny = dx / dist
  const cx = mx + nx * dist * bow
  const cy = my + ny * dist * bow
  return `M ${x1},${y1} Q ${cx},${cy} ${x2},${y2}`
}

function pct(value: number) {
  return `${(value / SIZE) * 100}%`
}

function Particle({ pathId, duration, delay }: { pathId: string; duration: number; delay: number }) {
  return (
    <circle r="3.5" className="fill-primary" filter="url(#network-glow)" opacity="0.9">
      <animateMotion dur={`${duration}s`} begin={`${delay}s`} repeatCount="indefinite">
        <mpath href={`#${pathId}`} />
      </animateMotion>
    </circle>
  )
}

export function GlobalSourcingMapSection() {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <section className="border-border/60 bg-background border-y py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Global textile network"
          title="A living network of sourcing regions"
          description="Veyra's AI hub connects buyers to specialty regions worldwide. Hover a node to see what it's known for."
        />

        <FadeIn delay={0.1}>
          <div className="relative mx-auto mt-16 aspect-square max-w-2xl">
            <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="absolute inset-0 size-full overflow-visible">
              <defs>
                <filter id="network-glow" x="-80%" y="-80%" width="260%" height="260%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Secondary web connections */}
              {secondaryEdges.map(([fromName, toName], edgeIndex) => {
                const fromIndex = regions.findIndex((r) => r.name === fromName)
                const toIndex = regions.findIndex((r) => r.name === toName)
                const from = nodePositions[fromIndex]
                const to = nodePositions[toIndex]
                const pathId = `secondary-${edgeIndex}`
                const isHighlighted = hovered === fromIndex || hovered === toIndex
                return (
                  <g key={pathId}>
                    <path
                      id={pathId}
                      d={curvedPath(from.x, from.y, to.x, to.y, 0.12)}
                      fill="none"
                      className={isHighlighted ? "stroke-primary/60" : "stroke-border"}
                      strokeWidth={isHighlighted ? 1.6 : 1}
                      strokeDasharray="3 5"
                      style={{ transition: "stroke 0.2s ease, stroke-width 0.2s ease" }}
                    />
                    <Particle pathId={pathId} duration={4.5} delay={edgeIndex * 0.6} />
                  </g>
                )
              })}

              {/* Primary hub connections — gently pulsing */}
              {regions.map((_, index) => {
                const node = nodePositions[index]
                const pathId = `primary-${index}`
                const bow = index % 2 === 0 ? 0.16 : -0.16
                const active = hovered === index
                const dimmed = hovered !== null && !active
                return (
                  <g key={pathId}>
                    <motion.path
                      id={pathId}
                      d={curvedPath(CENTER.x, CENTER.y, node.x, node.y, bow)}
                      fill="none"
                      className={active ? "stroke-primary" : "stroke-primary/35"}
                      strokeWidth={active ? 2.4 : 1.5}
                      strokeLinecap="round"
                      filter={active ? "url(#network-glow)" : undefined}
                      style={{ transition: "stroke 0.2s ease, stroke-width 0.2s ease" }}
                      animate={
                        dimmed
                          ? { opacity: 0.25 }
                          : { opacity: [0.55, 1, 0.55] }
                      }
                      transition={
                        dimmed
                          ? { duration: 0.2 }
                          : { duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }
                      }
                    />
                    {!dimmed && <Particle pathId={pathId} duration={3.2} delay={index * 0.3} />}
                  </g>
                )
              })}
            </svg>

            {/* Hub */}
            <div
              className="border-primary/20 bg-card absolute z-10 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border shadow-lg"
              style={{ left: pct(CENTER.x), top: pct(CENTER.y) }}
            >
              <VeyraMark className="text-primary size-7" />
            </div>

            {/* Country nodes */}
            {regions.map((region, index) => {
              const node = nodePositions[index]
              const isTopHalf = node.y < CENTER.y
              const active = hovered === index
              return (
                <div
                  key={region.name}
                  className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: pct(node.x), top: pct(node.y) }}
                  onMouseEnter={() => setHovered(index)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(index)}
                  onBlur={() => setHovered(null)}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.6 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: 0.3 + index * 0.06, type: "spring" }}
                    className="relative flex flex-col items-center gap-1.5"
                  >
                    <button
                      type="button"
                      className={`border-border bg-card flex size-14 items-center justify-center rounded-full border text-2xl shadow-sm transition-all ${
                        active ? "border-primary/60 scale-110 shadow-md" : "hover:scale-105"
                      }`}
                      aria-label={`${region.name} sourcing details`}
                    >
                      {region.flag}
                    </button>
                    <span className="text-foreground text-[11px] font-medium whitespace-nowrap">
                      {region.name}
                    </span>

                    <AnimatePresence>
                      {active && (
                        <motion.div
                          initial={{ opacity: 0, y: isTopHalf ? -6 : 6, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: isTopHalf ? -6 : 6, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className={`border-border bg-popover text-popover-foreground absolute left-1/2 z-20 w-60 -translate-x-1/2 overflow-hidden rounded-xl border shadow-xl ${
                            isTopHalf ? "top-full mt-3" : "bottom-full mb-3"
                          }`}
                        >
                          <div className="bg-primary/8 flex items-center gap-2 px-4 py-2.5">
                            <span className="text-xl leading-none">{region.flag}</span>
                            <div>
                              <p className="text-sm font-semibold">{region.name}</p>
                              <p className="text-primary text-[11px]">{region.specialty}</p>
                            </div>
                          </div>
                          <div className="px-4 py-3">
                            <p className="text-muted-foreground text-[11px] leading-relaxed">
                              {region.description}
                            </p>
                            <p className="text-foreground mt-2.5 text-[10px] font-medium">
                              Popular products
                            </p>
                            <p className="text-muted-foreground mt-0.5 text-[11px]">
                              {region.popularProducts.join(", ")}
                            </p>
                            <div className="mt-2.5 flex flex-wrap gap-1">
                              {region.categories.map((cat) => (
                                <span
                                  key={cat}
                                  className="border-border text-muted-foreground rounded-full border px-1.5 py-0.5 text-[9px]"
                                >
                                  {cat}
                                </span>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              )
            })}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
