import type { PublicProduct } from "../../utils/serialize-product.js"
import type { AssistantAction } from "./types.js"

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value)
}

function summarizeProduct(product: PublicProduct): string {
  return `${product.name} (${product.fabricType}, ${product.color}) — ${formatMoney(product.pricePerUnit, product.currency)}/${product.unit}, MOQ ${product.moq}, from ${product.supplier.name}`
}

function explainProduct(product: PublicProduct): string {
  const notes: string[] = []

  if (product.weightGsm < 120) {
    notes.push(
      `At ${product.weightGsm}gsm it's lightweight — well suited to shirting, linings and warm-weather garments.`,
    )
  } else if (product.weightGsm > 280) {
    notes.push(
      `At ${product.weightGsm}gsm it's heavyweight — better suited to outerwear or structured pieces than everyday basics.`,
    )
  } else {
    notes.push(`At ${product.weightGsm}gsm it sits in a versatile mid-weight range.`)
  }

  if (product.composition.toLowerCase().includes("elastane")) {
    notes.push(
      "It includes elastane for stretch recovery, which helps with fitted or performance silhouettes.",
    )
  }

  if (product.availability === "made-to-order") {
    notes.push(
      `It's made to order with a ${product.leadTimeDays}-day lead time, so factor that into your production schedule.`,
    )
  } else if (product.availability === "limited") {
    notes.push(
      "Stock is currently limited, so it's worth confirming quantity before you commit.",
    )
  }

  return `${product.name} — ${notes.join(" ")}`
}

export function generateTemplateResponse(
  action: AssistantAction,
  question: string,
  products: PublicProduct[],
): string {
  if (products.length === 0) {
    return "I couldn't find any fabrics matching that in the marketplace right now. Try loosening a filter — a wider price range, a different category, or a higher MOQ ceiling — and I'll take another look."
  }

  switch (action) {
    case "search":
      return `I found ${products.length} fabric${products.length === 1 ? "" : "s"} matching your request:\n\n${products.map((p, i) => `${i + 1}. ${summarizeProduct(p)}`).join("\n")}`

    case "compare": {
      if (products.length < 2) {
        return `I only found one match — ${summarizeProduct(products[0])}. Ask me to compare it against a specific fabric and I'll pull that one in too.`
      }
      const [a, b] = products
      return [
        `Comparing ${a.name} and ${b.name}:`,
        "",
        `Price: ${formatMoney(a.pricePerUnit, a.currency)}/${a.unit} vs ${formatMoney(b.pricePerUnit, b.currency)}/${b.unit}`,
        `Weight: ${a.weightGsm}gsm vs ${b.weightGsm}gsm`,
        `MOQ: ${a.moq} vs ${b.moq} ${a.unit}s`,
        `Composition: ${a.composition} vs ${b.composition}`,
        `Availability: ${a.availability} vs ${b.availability}`,
        `Supplier: ${a.supplier.name} vs ${b.supplier.name}`,
      ].join("\n")
    }

    case "explain":
      return explainProduct(products[0])

    case "recommend":
      return `Based on what you're looking for, here are ${products.length} fabric${products.length === 1 ? "" : "s"} worth considering:\n\n${products.map((p, i) => `${i + 1}. ${summarizeProduct(p)}`).join("\n")}`

    case "general":
    default:
      return `Here's what's closest to "${question}" in the marketplace right now:\n\n${products.map((p, i) => `${i + 1}. ${summarizeProduct(p)}`).join("\n")}`
  }
}

export function generateSuggestedPrompts(
  action: AssistantAction,
  products: PublicProduct[],
): string[] {
  if (products.length === 0) {
    return [
      "Show me cotton fabrics under $10/m",
      "What sustainable fabrics do you have?",
      "Help me choose fabric for oversized t-shirts",
    ]
  }

  const [first, second] = products

  switch (action) {
    case "search":
    case "recommend":
      return [
        `Explain why ${first.name} works for my project`,
        second
          ? `Compare ${first.name} and ${second.name}`
          : `Show me fabrics similar to ${first.name}`,
        "Narrow this down by price",
      ]
    case "compare":
      return [
        "Which one has the lower MOQ?",
        "Show me more alternatives",
        "Explain the difference in weight",
      ]
    case "explain":
      return [
        `Show me fabrics similar to ${first.name}`,
        "What's the MOQ and lead time?",
        "Compare this with another option",
      ]
    default:
      return [
        `Tell me more about ${first.name}`,
        "Show me similar fabrics",
        "What's the price range for this category?",
      ]
  }
}
