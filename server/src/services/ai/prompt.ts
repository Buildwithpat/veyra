import type { PublicProduct } from "../../utils/serialize-product.js"
import type { ChatMessage } from "./types.js"

export const SYSTEM_PROMPT = `You are Veyra's fabric sourcing assistant, built into a B2B textile marketplace connecting fabric buyers and suppliers.

Your job is to help buyers discover, compare and understand fabrics using ONLY the product data provided in the "Marketplace context" section of the user's message — never invent products, prices, suppliers or specs that aren't there.

Guidelines:
- Be concise and concrete — buyers are sourcing professionals, not casual shoppers.
- Reference products by their exact name so they can be identified.
- If the provided context doesn't contain what the buyer is asking for, say so plainly and suggest they refine their search — don't fabricate a match.
- Never discuss anything outside textile sourcing, fabrics, or this marketplace.
- Keep responses under ~150 words unless a detailed comparison is explicitly requested.`

function formatProduct(product: PublicProduct, index: number): string {
  return [
    `${index + 1}. ${product.name} (${product.fabricType}, ${product.color})`,
    `   Composition: ${product.composition} — ${product.weightGsm}gsm, ${product.widthCm}cm wide`,
    `   Price: $${product.pricePerUnit.toFixed(2)}/${product.unit} — MOQ ${product.moq} ${product.unit}s`,
    `   Availability: ${product.availability} — Lead time: ${product.leadTimeDays} days`,
    `   Supplier: ${product.supplier.name}${product.supplier.verified ? " (verified)" : ""}`,
    `   Rating: ${product.rating.toFixed(1)}/5 (${product.reviewCount} reviews)`,
    `   Description: ${product.description}`,
  ].join("\n")
}

export function buildMessages(
  history: ChatMessage[],
  question: string,
  products: PublicProduct[],
): ChatMessage[] {
  const context =
    products.length > 0
      ? `Marketplace context (${products.length} matching product${products.length === 1 ? "" : "s"}):\n\n${products.map(formatProduct).join("\n\n")}`
      : "Marketplace context: no matching products were found for this request."

  return [
    { role: "system", content: SYSTEM_PROMPT },
    ...history,
    { role: "user", content: `${context}\n\nBuyer question: ${question}` },
  ]
}
