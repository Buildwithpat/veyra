import { motion } from "framer-motion"
import {
  BarChart3,
  Compass,
  FileSearch,
  GitCompare,
  PackageCheck,
  Search,
  ShieldCheck,
} from "lucide-react"

import { FadeIn } from "@/components/shared/fade-in"
import { SectionHeading } from "@/components/shared/section-heading"
import { VeyraAiIcon } from "@/components/shared/veyra-ai-icon"

function MatchScorePreview() {
  return (
    <motion.div className="flex items-center gap-3" initial="rest" whileHover="hover" animate="rest">
      <svg viewBox="0 0 40 40" className="size-12 -rotate-90">
        <circle cx="20" cy="20" r="16" strokeWidth="4" className="stroke-border" fill="none" />
        <motion.circle
          cx="20"
          cy="20"
          r="16"
          strokeWidth="4"
          strokeLinecap="round"
          className="stroke-primary"
          fill="none"
          strokeDasharray={100.5}
          variants={{ rest: { strokeDashoffset: 100.5 }, hover: { strokeDashoffset: 100.5 * 0.06 } }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      </svg>
      <div>
        <p className="text-foreground text-sm font-semibold">94% match</p>
        <p className="text-muted-foreground text-xs">Computed from real listing signals</p>
      </div>
    </motion.div>
  )
}

function ComparisonPreview() {
  return (
    <motion.div className="flex flex-col gap-2" initial="rest" whileHover="hover" animate="rest">
      {[72, 48].map((value, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-muted-foreground w-14 shrink-0 text-[11px]">Fabric {i + 1}</span>
          <div className="bg-muted h-2 flex-1 overflow-hidden rounded-full">
            <motion.div
              className="bg-primary h-full rounded-full"
              style={{ opacity: i === 0 ? 1 : 0.55 }}
              variants={{ rest: { width: "20%" }, hover: { width: `${value}%` } }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            />
          </div>
        </div>
      ))}
    </motion.div>
  )
}

function DiscoveryPreview() {
  const flags = ["🇮🇳", "🇮🇹", "🇹🇷", "🇧🇩"]
  return (
    <motion.div className="flex gap-1.5" initial="rest" whileHover="hover" animate="rest">
      {flags.map((flag, i) => (
        <motion.span
          key={flag}
          className="border-border bg-surface flex size-8 items-center justify-center rounded-full border text-sm"
          variants={{ rest: { y: 0 }, hover: { y: -4 } }}
          transition={{ delay: i * 0.06, type: "spring", stiffness: 300 }}
        >
          {flag}
        </motion.span>
      ))}
    </motion.div>
  )
}

function SpecsPreview() {
  const specs = ["GSM 240", "150cm wide", "MOQ 100m"]
  return (
    <motion.div className="flex flex-col gap-1" initial="rest" whileHover="hover" animate="rest">
      {specs.map((spec, i) => (
        <motion.p
          key={spec}
          className="text-muted-foreground text-[11px]"
          variants={{ rest: { opacity: 0.4, x: 0 }, hover: { opacity: 1, x: 3 } }}
          transition={{ delay: i * 0.08 }}
        >
          {spec}
        </motion.p>
      ))}
    </motion.div>
  )
}

function SmartSearchPreview() {
  return (
    <motion.div
      className="border-border bg-surface flex items-center gap-2 rounded-lg border px-2.5 py-1.5"
      initial="rest"
      whileHover="hover"
      animate="rest"
    >
      <Search className="text-muted-foreground size-3.5 shrink-0" />
      <motion.span
        className="text-muted-foreground overflow-hidden text-[11px] whitespace-nowrap"
        variants={{ rest: { width: 0 }, hover: { width: "9ch" } }}
        transition={{ duration: 0.5 }}
      >
        black denim
      </motion.span>
    </motion.div>
  )
}

function VerifiedPreview() {
  return (
    <motion.div className="flex items-center gap-2" initial="rest" whileHover="hover" animate="rest">
      <motion.span
        className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full"
        variants={{ rest: { rotate: 0, scale: 1 }, hover: { rotate: 8, scale: 1.1 } }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <ShieldCheck className="size-4" />
      </motion.span>
      <p className="text-muted-foreground text-[11px]">Certifications, ratings, response time</p>
    </motion.div>
  )
}

function OrderTrackingPreview() {
  const stages = ["Placed", "Processing", "Shipped"]
  return (
    <motion.div className="flex items-center gap-1.5" initial="rest" whileHover="hover" animate="rest">
      {stages.map((stage, i) => (
        <div key={stage} className="flex items-center gap-1.5">
          <motion.span
            className="bg-border size-2 rounded-full"
            variants={{ rest: { backgroundColor: "var(--border)" }, hover: { backgroundColor: "var(--primary)" } }}
            transition={{ delay: i * 0.15 }}
          />
          {i < stages.length - 1 && <span className="bg-border h-px w-4" />}
        </div>
      ))}
    </motion.div>
  )
}

function IntelligencePreview() {
  const bars = [30, 55, 40, 70, 50]
  return (
    <motion.div className="flex h-8 items-end gap-1" initial="rest" whileHover="hover" animate="rest">
      {bars.map((height, i) => (
        <motion.span
          key={i}
          className="bg-primary/70 w-2 rounded-t-sm"
          variants={{ rest: { height: "20%" }, hover: { height: `${height}%` } }}
          transition={{ delay: i * 0.05, duration: 0.4 }}
        />
      ))}
    </motion.div>
  )
}

const capabilities = [
  {
    icon: VeyraAiIcon,
    title: "AI Fabric Matching",
    description: "Every listing carries a real, computed match score — never a random number.",
    preview: MatchScorePreview,
    large: true,
  },
  {
    icon: GitCompare,
    title: "Intelligent Material Comparison",
    description: "Weigh weight, price, lead time and certifications side-by-side, instantly.",
    preview: ComparisonPreview,
    large: true,
  },
  {
    icon: Compass,
    title: "Supplier Discovery",
    description: "Browse verified mills and wholesalers across every sourcing region.",
    preview: DiscoveryPreview,
  },
  {
    icon: FileSearch,
    title: "Rich Technical Specifications",
    description: "GSM, width, composition and MOQ on every single listing.",
    preview: SpecsPreview,
  },
  {
    icon: Search,
    title: "Smart Search",
    description: "Natural language or structured filters — search however you think.",
    preview: SmartSearchPreview,
  },
  {
    icon: ShieldCheck,
    title: "Verified Supplier Profiles",
    description: "Certifications, ratings and response times you can actually check.",
    preview: VerifiedPreview,
  },
  {
    icon: PackageCheck,
    title: "Transparent Order Tracking",
    description: "Every order's status is visible to both sides, in real time.",
    preview: OrderTrackingPreview,
  },
  {
    icon: BarChart3,
    title: "Marketplace Intelligence",
    description: "Insight cards surface what makes a fabric right for your use case.",
    preview: IntelligencePreview,
  },
]

export function WhyChooseVeyraSection() {
  return (
    <section id="why-veyra" className="bg-accent/40 border-border/60 border-y py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          align="left"
          eyebrow="Why Veyra"
          title="Built as a real product, not a demo"
          description="No fabricated statistics, no fake logos — just what the platform actually does, shown in action."
        />

        <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-12">
          {capabilities.map((capability, index) => (
            <FadeIn
              key={capability.title}
              delay={Math.min(index * 0.05, 0.3)}
              className={capability.large ? "lg:col-span-6" : "lg:col-span-4"}
            >
              <div className="border-border bg-card group flex h-full flex-col justify-between gap-6 rounded-2xl border p-6 transition-colors hover:border-primary/30">
                <div>
                  <span className="bg-primary/10 text-primary mb-4 flex size-9 items-center justify-center rounded-lg">
                    <capability.icon className="size-4" />
                  </span>
                  <h3 className="font-display text-foreground text-lg font-semibold">
                    {capability.title}
                  </h3>
                  <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                    {capability.description}
                  </p>
                </div>
                <div className="border-border/70 border-t pt-4">
                  <capability.preview />
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
