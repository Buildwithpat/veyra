import type { UserRole } from "@/features/auth/types"

export interface Message {
  id: string
  senderId: string
  recipientId: string
  body: string
  productId?: string
  productName?: string
  productSlug?: string
  read: boolean
  createdAt: string
}

export interface Conversation {
  otherUserId: string
  otherUserName: string
  otherUserRole: UserRole
  lastMessageBody: string
  lastMessageAt: string
  unreadCount: number
  productName?: string
}

export interface ConversationThread {
  otherUser: {
    id: string
    name: string
    role: UserRole
  }
  messages: Message[]
}

export interface SendMessageInput {
  recipientId: string
  body: string
  productId?: string
}
