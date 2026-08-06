import { motion } from "framer-motion"
import { GitCompare, MessageSquare, PackageCheck, Search, ShieldCheck, Users } from "lucide-react"

import { SectionHeading } from "@/components/shared/section-heading"
import { VeyraAiIcon } from "@/components/shared/veyra-ai-icon"

/** Small illustrative UI snippets — not real components, just the journey's visual beats. */
function SearchSnippet() {
  return (
    <div className="border-border bg-card flex items-center gap-2 rounded-xl border px-4 py-3 shadow-sm">
      <Search className="text-muted-foreground size-4 shrink-0" />
      <span className="text-muted-foreground text-xs">
        250 GSM black cotton for hoodies
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="bg-foreground ml-0.5 inline-block h-3 w-px align-middle"
        />
      </span>
    </div>
  )
}

function AiSnippet() {
  const chips = ["250 GSM", "Black", "Cotton"]
  return (
    <div className="border-border bg-card flex flex-col gap-2.5 rounded-xl border px-4 py-3 shadow-sm">
      <div className="flex items-center gap-2">
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
          className="text-primary"
        >
          <VeyraAiIcon className="size-4" />
        </motion.span>
        <span className="text-muted-foreground text-xs">Parsing your brief...</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {chips.map((chip, i) => (
          <motion.span
            key={chip}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.12 }}
            className="bg-accent text-accent-foreground rounded-full px-2 py-0.5 text-[10px] font-medium"
          >
            {chip}
          </motion.span>
        ))}
      </div>
    </div>
  )
}

function DiscoverySnippet() {
  const suppliers = ["🇮🇳", "🇹🇷", "🇵🇹"]
  return (
    <div className="border-border bg-card flex items-center gap-3 rounded-xl border px-4 py-3 shadow-sm">
      <Users className="text-muted-foreground size-4 shrink-0" />
      <div className="flex -space-x-2">
        {suppliers.map((flag, i) => (
          <motion.span
            key={flag}
            initial={{ opacity: 0, x: -6 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="border-card bg-surface flex size-7 items-center justify-center rounded-full border-2 text-sm"
          >
            {flag}
          </motion.span>
        ))}
      </div>
      <span className="text-muted-foreground text-xs">12 verified matches</span>
    </div>
  )
}

function CompareSnippet() {
  return (
    <div className="border-border bg-card flex flex-col gap-2 rounded-xl border px-4 py-3 shadow-sm">
      <div className="flex items-center gap-2 text-[10px]">
        <span className="text-muted-foreground w-16 shrink-0">Cotton A</span>
        <div className="bg-muted h-1.5 flex-1 overflow-hidden rounded-full">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "72%" }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-primary h-full rounded-full"
          />
        </div>
      </div>
      <div className="flex items-center gap-2 text-[10px]">
        <span className="text-muted-foreground w-16 shrink-0">Cotton B</span>
        <div className="bg-muted h-1.5 flex-1 overflow-hidden rounded-full">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "54%" }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="bg-primary/60 h-full rounded-full"
          />
        </div>
      </div>
    </div>
  )
}

function ConnectSnippet() {
  return (
    <div className="border-border bg-card flex items-center gap-3 rounded-xl border px-4 py-3 shadow-sm">
      <MessageSquare className="text-muted-foreground size-4 shrink-0" />
      <div className="flex-1">
        <p className="text-foreground text-xs font-medium">Ahmedabad Weaves</p>
        <p className="text-muted-foreground text-[10px]">Responds in &lt; 4 hrs</p>
      </div>
      <ShieldCheck className="text-primary size-4" />
    </div>
  )
}

function OrderSnippet() {
  return (
    <div className="border-border bg-card flex items-center gap-3 rounded-xl border px-4 py-3 shadow-sm">
      <motion.span
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.2 }}
        className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-full"
      >
        <PackageCheck className="size-4" />
      </motion.span>
      <div>
        <p className="text-foreground text-xs font-medium">Order placed</p>
        <p className="text-muted-foreground text-[10px]">Tracked from your dashboard</p>
      </div>
    </div>
  )
}

const journey = [
  {
    icon: Search,
    title: "Describe what you need",
    description: "Type a sourcing brief in plain language — no filters, no forms.",
    snippet: SearchSnippet,
  },
  {
    icon: VeyraAiIcon,
    title: "Veyra understands it",
    description: "The AI parses material, GSM, color and budget straight from your words.",
    snippet: AiSnippet,
  },
  {
    icon: Users,
    title: "Suppliers surface",
    description: "Verified listings matching your brief appear from the live marketplace.",
    snippet: DiscoverySnippet,
  },
  {
    icon: GitCompare,
    title: "Compare side-by-side",
    description: "Weigh weight, price, lead time and certifications at a glance.",
    snippet: CompareSnippet,
  },
  {
    icon: MessageSquare,
    title: "Connect with confidence",
    description: "Reach the supplier directly through a verified profile.",
    snippet: ConnectSnippet,
  },
  {
    icon: PackageCheck,
    title: "Place the order",
    description: "Check out and track fulfillment from your dashboard.",
    snippet: OrderSnippet,
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="border-border/60 bg-surface border-y py-24">
      <div className="mx-auto max-w-4xl px-6">
        <SectionHeading eyebrow="How Veyra works" title="From a sentence to a shipped order" />

        <div className="relative mt-20">
          <div
            className="bg-border/70 pointer-events-none absolute top-0 bottom-0 left-1/2 hidden w-px -translate-x-1/2 md:block"
            aria-hidden
          />

          <div className="flex flex-col gap-16">
            {journey.map((step, index) => {
              const reversed = index % 2 === 1
              const Snippet = step.snippet
              return (
                <div
                  key={step.title}
                  className={`grid grid-cols-1 items-center gap-6 md:grid-cols-2 md:gap-10 ${
                    reversed ? "md:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  <motion.div
                    initial={{ opacity: 0, x: reversed ? 24 : -24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.45 }}
                    className={`flex flex-col gap-3 ${reversed ? "md:items-end md:text-right" : ""}`}
                  >
                    <div className={`flex items-center gap-3 ${reversed ? "md:flex-row-reverse" : ""}`}>
                      <span className="bg-primary text-primary-foreground relative z-10 flex size-11 items-center justify-center rounded-full shadow-sm">
                        <step.icon className="size-4.5" />
                      </span>
                      <span className="text-muted-foreground text-xs font-medium">
                        Step {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="font-display text-foreground text-xl font-semibold">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.45, delay: 0.1 }}
                    className="w-full max-w-xs md:justify-self-start"
                  >
                    <Snippet />
                  </motion.div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
