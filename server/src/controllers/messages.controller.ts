import { z } from "zod"

import { Message, type MessageDocument } from "../models/message.model.js"
import { User } from "../models/user.model.js"
import { createMessage } from "../services/messaging.service.js"
import { ApiError, sendSuccess } from "../utils/api-response.js"
import { asyncHandler } from "../utils/async-handler.js"

export const sendMessageSchema = z.object({
  recipientId: z.string().min(1),
  body: z.string().trim().min(1).max(2000),
  productId: z.string().min(1).optional(),
})

function toMessageResponse(message: MessageDocument) {
  return {
    id: String(message._id),
    senderId: String(message.sender),
    recipientId: String(message.recipient),
    body: message.body,
    productId: message.productId ? String(message.productId) : undefined,
    productName: message.productName,
    productSlug: message.productSlug,
    read: message.read,
    createdAt: message.createdAt,
  }
}

export const sendMessage = asyncHandler(async (req, res) => {
  const { recipientId, body, productId } = req.body as z.infer<typeof sendMessageSchema>
  const senderId = req.auth!.sub

  const message = await createMessage({ senderId, recipientId, body, productId })

  sendSuccess(res, toMessageResponse(message), "Message sent", 201)
})

export const listConversations = asyncHandler(async (req, res) => {
  const userId = req.auth!.sub

  const messages = await Message.find({
    $or: [{ sender: userId }, { recipient: userId }],
  }).sort({ createdAt: -1 })

  // Group by "the other party" in plain JS — simple and correct at this
  // app's scale, and easier to reason about than an aggregation pipeline.
  const byOtherParty = new Map<
    string,
    { lastMessage: MessageDocument; unreadCount: number }
  >()

  for (const message of messages) {
    const isSender = String(message.sender) === userId
    const otherPartyId = isSender ? String(message.recipient) : String(message.sender)
    const isUnreadForMe = !isSender && !message.read

    const existing = byOtherParty.get(otherPartyId)
    if (!existing) {
      byOtherParty.set(otherPartyId, {
        lastMessage: message,
        unreadCount: isUnreadForMe ? 1 : 0,
      })
    } else if (isUnreadForMe) {
      existing.unreadCount += 1
    }
  }

  const otherPartyIds = [...byOtherParty.keys()]
  const otherUsers = await User.find({ _id: { $in: otherPartyIds } })
  const otherUsersById = new Map(otherUsers.map((u) => [String(u._id), u]))

  const conversations = otherPartyIds
    .map((otherPartyId) => {
      const entry = byOtherParty.get(otherPartyId)!
      const otherUser = otherUsersById.get(otherPartyId)
      if (!otherUser) return null

      return {
        otherUserId: otherPartyId,
        otherUserName: otherUser.name,
        otherUserRole: otherUser.role,
        lastMessageBody: entry.lastMessage.body,
        lastMessageAt: entry.lastMessage.createdAt,
        unreadCount: entry.unreadCount,
        productName: entry.lastMessage.productName,
      }
    })
    .filter((c): c is NonNullable<typeof c> => c !== null)
    .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime())

  sendSuccess(res, conversations)
})

export const getConversation = asyncHandler(async (req, res) => {
  const userId = req.auth!.sub
  const otherUserId = req.params.userId

  const otherUser = await User.findById(otherUserId)
  if (!otherUser) {
    throw new ApiError(404, "User not found")
  }

  const messages = await Message.find({
    $or: [
      { sender: userId, recipient: otherUserId },
      { sender: otherUserId, recipient: userId },
    ],
  }).sort({ createdAt: 1 })

  await Message.updateMany(
    { sender: otherUserId, recipient: userId, read: false },
    { $set: { read: true } },
  )

  sendSuccess(res, {
    otherUser: {
      id: String(otherUser._id),
      name: otherUser.name,
      role: otherUser.role,
    },
    messages: messages.map(toMessageResponse),
  })
})
