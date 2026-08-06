import type { AssistantAction, AssistantIntent } from "./types.js"

// Maps common fabric-family words to the category ids seeded in the catalog.
// Deliberately keyword-based rather than a DB lookup — keeps intent parsing
// synchronous, dependency-free and fully unit-testable.
const CATEGORY_KEYWORDS: Record<string, string> = {
  cotton: "cat-cotton",
  silk: "cat-silk",
  linen: "cat-linen",
  denim: "cat-denim",
  wool: "cat-wool",
  cashmere: "cat-wool",
  synthetic: "cat-synthetic",
  polyester: "cat-synthetic",
  nylon: "cat-synthetic",
  performance: "cat-synthetic",
  knit: "cat-knits",
  jersey: "cat-knits",
  sustainable: "cat-sustainable",
  organic: "cat-sustainable",
  recycled: "cat-sustainable",
}

const COLOR_KEYWORDS = [
  "white",
  "black",
  "navy",
  "blue",
  "green",
  "beige",
  "tan",
  "grey",
  "gray",
  "pink",
  "rust",
  "orange",
  "burgundy",
  "ivory",
  "charcoal",
  "sage",
  "slate",
]

const AVAILABILITY_KEYWORDS: Record<string, "in-stock" | "limited" | "made-to-order"> = {
  "in stock": "in-stock",
  "in-stock": "in-stock",
  "made to order": "made-to-order",
  "made-to-order": "made-to-order",
  limited: "limited",
}

const STOP_WORDS = new Set([
  "find",
  "search",
  "show",
  "with",
  "under",
  "below",
  "less",
  "than",
  "that",
  "this",
  "these",
  "those",
  "fabric",
  "fabrics",
  "meters",
  "would",
  "could",
  "should",
  "please",
  "want",
  "need",
  "looking",
  "help",
  "choose",
  "recommend",
  "suggest",
  "about",
  "which",
])

function extractPrice(text: string): number | undefined {
  const match = text.match(/(?:under|below|less than|<)\s*[₹$€£]?\s*(\d+(?:\.\d+)?)/i)
  return match ? Number(match[1]) : undefined
}

function extractMoq(text: string): number | undefined {
  const match =
    text.match(/moq\s*(?:of|below|under|less than)?\s*(\d+)/i) ??
    text.match(/(\d+)\s*(?:meters?|units?|yards?)?\s*moq/i)
  return match ? Number(match[1]) : undefined
}

function detectAction(text: string): AssistantAction {
  const lower = text.toLowerCase()
  if (/\bcompare\b|\bvs\.?\b|\bversus\b/.test(lower)) return "compare"
  if (/\bwhy\b|\bexplain\b|suitable for|good for/.test(lower)) return "explain"
  if (/\brecommend\b|\bsuggest\b|help me (choose|pick|find)|alternative/.test(lower)) {
    return "recommend"
  }
  if (/\bfind\b|\bsearch\b|show me|looking for|\bneed\b/.test(lower)) return "search"
  return "general"
}

export function parseIntent(message: string): AssistantIntent {
  const lower = message.toLowerCase()

  const categorySlugs = Array.from(
    new Set(
      Object.entries(CATEGORY_KEYWORDS)
        .filter(([keyword]) => lower.includes(keyword))
        .map(([, slug]) => slug),
    ),
  )

  const colors = COLOR_KEYWORDS.filter((color) => lower.includes(color))

  const availability = Array.from(
    new Set(
      Object.entries(AVAILABILITY_KEYWORDS)
        .filter(([phrase]) => lower.includes(phrase))
        .map(([, value]) => value),
    ),
  )

  const keywords = Array.from(
    new Set(
      lower
        .replace(/[^\w\s]/g, " ")
        .split(/\s+/)
        .filter((word) => word.length > 3 && !STOP_WORDS.has(word)),
    ),
  )

  return {
    action: detectAction(message),
    keywords,
    categorySlugs,
    colors,
    priceMax: extractPrice(message),
    moqMax: extractMoq(message),
    availability,
  }
}
