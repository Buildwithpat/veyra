import { Product } from "../../models/product.model.js"
import { createMessage } from "../messaging.service.js"
import { toPublicProduct, type PublicProduct } from "../../utils/serialize-product.js"

export interface SendMessageCommand {
  supplierQuery: string
  productQuery: string
  body: string
}

export interface ActionResult {
  chunks: string[]
  sources: PublicProduct[]
}

// Recognizes free-form requests like:
//   "send a message to Meridian Mills about Cotton Poplin: can you rush this?"
//   "message Meridian Mills about Cotton Poplin saying is this in stock?"
//   "tell Meridian Mills about Cotton Poplin that I need a bulk quote"
const SEND_MESSAGE_PATTERNS: RegExp[] = [
  /^(?:please\s+)?(?:send|write)\s+(?:a\s+)?message\s+to\s+(.+?)\s+about\s+(.+?)\s*(?:[:\-]|saying|that says|telling them)\s+(.+)$/i,
  /^message\s+(.+?)\s+about\s+(.+?)\s*[:\-]\s*(.+)$/i,
  /^(?:please\s+)?tell\s+(.+?)\s+about\s+(.+?)\s*(?:[:\-]|that|saying)\s+(.+)$/i,
]

export function detectSendMessageCommand(question: string): SendMessageCommand | null {
  const trimmed = question.trim()

  for (const pattern of SEND_MESSAGE_PATTERNS) {
    const match = trimmed.match(pattern)
    const supplierQuery = match?.[1]?.trim()
    const productQuery = match?.[2]?.trim()
    const body = match?.[3]?.trim()
    if (supplierQuery && productQuery && body) {
      return { supplierQuery, productQuery, body }
    }
  }

  return null
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/** Not authenticated → the chat can't attribute the message to anyone. */
export function sendMessageRequiresSignIn(): ActionResult {
  return {
    chunks: [
      "You'll need to sign in first — once you're logged in, I can send that message to the supplier on your behalf.",
    ],
    sources: [],
  }
}

export async function executeSendMessageAction(
  command: SendMessageCommand,
  senderId: string,
): Promise<ActionResult> {
  const product = await Product.findOne({
    name: { $regex: escapeRegExp(command.productQuery), $options: "i" },
    isActive: true,
  })
    .sort({ featured: -1, rating: -1 })
    .populate("category")
    .populate("supplier")

  if (!product) {
    return {
      chunks: [
        `I couldn't find a listing matching "${command.productQuery}" to attach your message to — try naming it exactly as it appears in the marketplace.`,
      ],
      sources: [],
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- populate() widens the doc type beyond what TS narrows generically here
  const publicProduct = toPublicProduct(product as any)
  const supplierId = publicProduct.supplier.id

  try {
    await createMessage({
      senderId,
      recipientId: supplierId,
      body: command.body,
      productId: String(product._id),
    })
  } catch {
    return {
      chunks: [
        `I found "${product.name}", but couldn't reach that supplier right now — try again in a moment, or use "Contact supplier" on the listing page.`,
      ],
      sources: [publicProduct],
    }
  }

  return {
    chunks: [
      `Sent — ${publicProduct.supplier.name} now has your message about "${product.name}":\n\n> ${command.body}\n\nFollow the conversation from your Messages inbox.`,
    ],
    sources: [publicProduct],
  }
}
