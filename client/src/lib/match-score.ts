import type { Product } from "@/features/marketplace/types"

/**
 * "AI Match Score" is a real, deterministic composite of a listing's actual
 * signals — never a random or fabricated number. It rewards verified
 * suppliers, real ratings, certification coverage and current availability,
 * so the same product always scores the same way.
 */
export function computeMatchScore(product: Product): number {
  let score = 62
  score += Math.round(product.rating * 5)
  score += product.supplier.verified ? 8 : 0
  score += Math.min(product.supplier.certifications.length * 3, 9)
  score += product.availability === "in-stock" ? 6 : product.availability === "limited" ? 2 : 0
  return Math.max(60, Math.min(99, score))
}

export interface QueryMatch {
  score: number
  reasons: string[]
}

interface ParsedQuery {
  keywords: string[]
  maxPrice: number | null
  gsm: number | null
  colors: string[]
}

const COLOR_WORDS = [
  "black",
  "white",
  "navy",
  "blue",
  "grey",
  "gray",
  "beige",
  "cream",
  "ivory",
  "olive",
  "terracotta",
  "brown",
  "red",
  "green",
  "tan",
  "charcoal",
]

/** Lightweight, dependency-free parse of a free-text sourcing brief. */
export function parseSourcingQuery(query: string): ParsedQuery {
  const lower = query.toLowerCase()
  const priceMatch = lower.match(/(?:under|below|less than|<)\s*[₹$€£]?\s*(\d+(?:\.\d+)?)/)
  const gsmMatch = lower.match(/(\d+)\s*gsm/)
  const colors = COLOR_WORDS.filter((color) => lower.includes(color))
  const keywords = lower
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3)

  return {
    keywords,
    maxPrice: priceMatch ? Number(priceMatch[1]) : null,
    gsm: gsmMatch ? Number(gsmMatch[1]) : null,
    colors,
  }
}

/** Explains, in plain language, why a real product matched a real query. */
export function computeQueryMatch(product: Product, query: string): QueryMatch {
  const parsed = parseSourcingQuery(query)
  let score = 70
  const reasons: string[] = []

  const haystack =
    `${product.name} ${product.fabricType} ${product.color} ${product.composition} ${product.category.name} ${product.tags.join(" ")}`.toLowerCase()

  const keywordHits = parsed.keywords.filter((word) => haystack.includes(word))
  if (keywordHits.length > 0) {
    score += Math.min(keywordHits.length * 4, 12)
    reasons.push(`Matches "${keywordHits.slice(0, 2).join(", ")}" in the brief`)
  }

  if (parsed.maxPrice != null) {
    if (product.pricePerUnit <= parsed.maxPrice) {
      score += 8
      reasons.push(`Within budget at $${product.pricePerUnit.toFixed(2)}/${product.unit}`)
    } else {
      score -= 10
    }
  }

  if (parsed.gsm != null) {
    const diff = Math.abs(product.weightGsm - parsed.gsm)
    if (diff <= 20) {
      score += 10
      reasons.push(`${product.weightGsm} gsm is close to the ${parsed.gsm} gsm requested`)
    } else if (diff <= 50) {
      score += 4
    }
  }

  if (parsed.colors.some((color) => product.color.toLowerCase().includes(color))) {
    score += 8
    reasons.push(`Color matches — ${product.color}`)
  }

  if (product.supplier.verified) {
    reasons.push("Verified supplier")
  }

  return {
    score: Math.max(45, Math.min(99, Math.round(score))),
    reasons: reasons.slice(0, 3),
  }
}
