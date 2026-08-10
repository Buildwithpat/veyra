import { useEffect, useMemo, useState, type FormEvent } from "react"
import { useQuery } from "@tanstack/react-query"
import { AnimatePresence, motion } from "framer-motion"
import { Search } from "lucide-react"

import { fallbackProducts } from "@/components/landing/fallback-products"
import { MarketplacePreviewCard } from "@/components/landing/marketplace-preview-card"
import { FadeIn } from "@/components/shared/fade-in"
import { SectionHeading } from "@/components/shared/section-heading"
import { VeyraAiIcon } from "@/components/shared/veyra-ai-icon"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAssistantPanel } from "@/features/assistant/hooks/use-assistant-panel"
import { fetchProducts } from "@/features/marketplace/api/marketplace-api"
import { emptyProductFilters } from "@/features/marketplace/default-filters"
import type { Product } from "@/features/marketplace/types"
import { computeQueryMatch, parseSourcingQuery } from "@/lib/match-score"

const EXAMPLE_QUERY = "Need 250 GSM black cotton for hoodies under $8/m"
const THINKING_STAGES = ["Parsing your brief...", "Matching against live suppliers..."]
const MIN_THINKING_MS = 900

type Phase = "idle" | "thinking" | "results"

function useLiveSearch(query: string, active: boolean) {
  return useQuery({
    queryKey: ["products", "ai-search-experience", query],
    queryFn: () => fetchProducts({ ...emptyProductFilters, search: query }, "relevance", 0),
    enabled: active && query.trim().length > 2,
    staleTime: 30 * 1000,
  })
}

export function AiSourcingDemoSection() {
  const [query, setQuery] = useState("")
  const [submitted, setSubmitted] = useState("")
  const [phase, setPhase] = useState<Phase>("idle")
  const [thinkingStage, setThinkingStage] = useState(0)
  const { openAssistant } = useAssistantPanel()

  const { data, isFetching } = useLiveSearch(submitted, phase !== "idle")

  useEffect(() => {
    if (phase !== "thinking") return
    setThinkingStage(0)
    const stageTimer = setTimeout(() => setThinkingStage(1), MIN_THINKING_MS / 2)
    const doneTimer = setTimeout(() => setPhase("results"), MIN_THINKING_MS)
    return () => {
      clearTimeout(stageTimer)
      clearTimeout(doneTimer)
    }
  }, [phase])

  function runQuery(value: string) {
    setQuery(value)
    setSubmitted(value)
    setPhase("thinking")
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (query.trim().length > 2) runQuery(query)
  }

  const parsed = useMemo(() => parseSourcingQuery(submitted), [submitted])
  const filterChips = useMemo(() => {
    const chips: string[] = []
    if (parsed.maxPrice != null) chips.push(`Under $${parsed.maxPrice}/m`)
    if (parsed.gsm != null) chips.push(`${parsed.gsm} GSM`)
    for (const color of parsed.colors) chips.push(color[0].toUpperCase() + color.slice(1))
    return chips
  }, [parsed])

  const isThinking = phase === "thinking" || (phase === "results" && isFetching)

  const scoredResults = useMemo(() => {
    if (phase !== "results" || isFetching) return []
    const realResults = data?.items ?? []
    const pool: Product[] = realResults.length > 0 ? realResults : fallbackProducts
    return pool
      .map((product) => ({ product, match: computeQueryMatch(product, submitted) }))
      .sort((a, b) => b.match.score - a.match.score)
      .slice(0, 3)
  }, [phase, isFetching, data, submitted])

  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading
          eyebrow="AI search, live"
          title="Watch the AI work, not read about it"
          description="Type a real sourcing brief. This parses your request and searches the live marketplace, right here."
        />

        <FadeIn delay={0.1} className="mt-12">
          <div className="border-border bg-card rounded-2xl border p-6 shadow-sm sm:p-8">
            <form onSubmit={handleSubmit} className="relative">
              <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={EXAMPLE_QUERY}
                aria-label="Describe the fabric you're sourcing"
                className="h-12 rounded-xl pr-24 pl-11 text-sm"
              />
              <Button type="submit" size="sm" className="absolute top-1/2 right-1.5 -translate-y-1/2">
                Search
              </Button>
            </form>

            {phase === "idle" && (
              <button
                type="button"
                onClick={() => runQuery(EXAMPLE_QUERY)}
                className="border-border text-muted-foreground hover:border-primary/40 hover:text-foreground mt-5 rounded-full border px-3 py-1.5 text-xs transition-colors"
              >
                Try: &ldquo;{EXAMPLE_QUERY}&rdquo;
              </button>
            )}

            <AnimatePresence mode="wait">
              {isThinking && (
                <motion.div
                  key="thinking"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 flex items-center gap-3"
                >
                  <span className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
                    >
                      <VeyraAiIcon className="size-4" />
                    </motion.span>
                  </span>
                  <p className="text-muted-foreground text-sm">{THINKING_STAGES[thinkingStage]}</p>
                </motion.div>
              )}

              {phase === "results" && !isThinking && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mt-6"
                >
                  {filterChips.length > 0 && (
                    <div className="mb-5 flex flex-wrap items-center gap-2">
                      <span className="text-muted-foreground text-xs">Filters detected:</span>
                      {filterChips.map((chip, index) => (
                        <motion.span
                          key={chip}
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.06 }}
                          className="bg-accent text-accent-foreground rounded-full px-2.5 py-1 text-[11px] font-medium"
                        >
                          {chip}
                        </motion.span>
                      ))}
                    </div>
                  )}

                  {scoredResults.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      {scoredResults.map(({ product, match }, index) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.3 }}
                          className="flex flex-col gap-2"
                        >
                          <MarketplacePreviewCard product={product} />
                          <div className="px-1">
                            <div className="bg-muted h-1 overflow-hidden rounded-full">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${match.score}%` }}
                                transition={{ delay: 0.2 + index * 0.1, duration: 0.6, ease: "easeOut" }}
                                className="bg-primary h-full rounded-full"
                              />
                            </div>
                            {match.reasons[0] && (
                              <p className="text-muted-foreground mt-1.5 text-[11px]">
                                {match.reasons[0]}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      No live matches for that yet. Try a different brief, or ask the assistant
                      directly.
                    </p>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-5 gap-1.5"
                    onClick={() => openAssistant({ prompt: submitted })}
                  >
                    <VeyraAiIcon className="size-3.5" />
                    Ask Veyra AI to explain these matches
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
