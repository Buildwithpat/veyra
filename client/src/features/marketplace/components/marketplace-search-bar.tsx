import { useEffect, useRef, useState, type FormEvent } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Clock } from "lucide-react"

import { VeyraAiIcon } from "@/components/shared/veyra-ai-icon"
import { Input } from "@/components/ui/input"
import { parseSourcingQuery } from "@/lib/match-score"

const EXAMPLE_PROMPTS = [
  "Sustainable cotton under $10/m",
  "250 GSM black denim",
  "Silk under $20/m",
]

const RECENT_KEY = "veyra-marketplace-recent-searches"

function readRecent(): string[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(RECENT_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveRecent(query: string) {
  const next = [query, ...readRecent().filter((q) => q !== query)].slice(0, 5)
  window.localStorage.setItem(RECENT_KEY, JSON.stringify(next))
}

interface MarketplaceSearchBarProps {
  value: string
  onSearch: (query: string) => void
  onDetectPriceMax: (value: number) => void
}

/**
 * AI-first search: a typed brief like "sustainable cotton under $10/m" both
 * runs as a real keyword search (backed by the products text index) and has
 * its price constraint parsed out and applied as a real filter — reusing
 * the same dependency-free parser built for the landing page's AI demo.
 */
export function MarketplaceSearchBar({ value, onSearch, onDetectPriceMax }: MarketplaceSearchBarProps) {
  const [draft, setDraft] = useState(value)
  const [open, setOpen] = useState(false)
  const [recent, setRecent] = useState<string[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => setDraft(value), [value])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function runQuery(query: string) {
    const trimmed = query.trim()
    if (!trimmed) return
    setDraft(trimmed)
    onSearch(trimmed)

    const parsed = parseSourcingQuery(trimmed)
    if (parsed.maxPrice != null) onDetectPriceMax(parsed.maxPrice)

    saveRecent(trimmed)
    setRecent(readRecent())
    setOpen(false)
  }

  function handleChange(next: string) {
    setDraft(next)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => onSearch(next), 300)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    clearTimeout(debounceRef.current)
    runQuery(draft)
  }

  const suggestions = draft.trim()
    ? EXAMPLE_PROMPTS.filter((p) => p.toLowerCase().includes(draft.toLowerCase()))
    : EXAMPLE_PROMPTS

  return (
    <div ref={containerRef} className="relative flex-1">
      <form onSubmit={handleSubmit} className="relative">
        <VeyraAiIcon className="text-primary pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
        <Input
          value={draft}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => {
            setRecent(readRecent())
            setOpen(true)
          }}
          placeholder='Try "sustainable cotton under $10/m"'
          aria-label="Search fabrics with natural language or keywords"
          className="h-11 rounded-full pl-10 text-sm"
        />
      </form>

      <AnimatePresence>
        {open && (recent.length > 0 || suggestions.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="border-border bg-popover text-popover-foreground absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-xl border shadow-lg"
          >
            {recent.length > 0 && (
              <div className="border-border/60 border-b p-1.5">
                <p className="text-muted-foreground px-2 py-1 text-[10px] font-medium tracking-wide uppercase">
                  Recent
                </p>
                {recent.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => runQuery(q)}
                    className="hover:bg-accent flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors"
                  >
                    <Clock className="text-muted-foreground size-3.5 shrink-0" />
                    <span className="truncate">{q}</span>
                  </button>
                ))}
              </div>
            )}
            {suggestions.length > 0 && (
              <div className="p-1.5">
                <p className="text-muted-foreground px-2 py-1 text-[10px] font-medium tracking-wide uppercase">
                  Try asking
                </p>
                {suggestions.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => runQuery(prompt)}
                    className="hover:bg-accent flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors"
                  >
                    <VeyraAiIcon className="text-primary size-3.5 shrink-0" />
                    <span className="truncate">{prompt}</span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
