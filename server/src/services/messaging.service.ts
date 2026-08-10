import { Message, type MessageDocument } from "../models/message.model.js"
import { Product } from "../models/product.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/api-response.js"

export interface CreateMessageInput {
  senderId: string
  recipientId: string
  body: string
  productId?: string
}

/**
 * Single code path for creating a message — used by the HTTP controller
 * (`POST /messages`) and callable directly from other server code (e.g. the
 * AI assistant's action-detection flow) that needs to send a message without
 * going through Express. Throws `ApiError` for anything callers should
 * surface to the end user.
 */
export async function createMessage({
  senderId,
  recipientId,
  body,
  productId,
}: CreateMessageInput): Promise<MessageDocument> {
  if (recipientId === senderId) {
    throw new ApiError(400, "Can't message yourself")
  }

  const recipient = await User.findById(recipientId)
  if (!recipient) {
    throw new ApiError(404, "Recipient not found")
  }

  let productSnapshot: { productId: string; productName: string; productSlug: string } | undefined

  if (productId) {
    const product = await Product.findById(productId)
    if (!product) {
      throw new ApiError(404, "Product not found")
    }
    productSnapshot = {
      productId: String(product._id),
      productName: product.name,
      productSlug: product.slug,
    }
  }

  return Message.create({
    sender: senderId,
    recipient: recipientId,
    body,
    ...productSnapshot,
  })
}
