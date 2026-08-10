import { apiClient } from "@/lib/api-client"
import type {
  Conversation,
  ConversationThread,
  Message,
  SendMessageInput,
} from "@/features/messaging/types"
import type { ApiSuccess } from "@/types/api"

export const messagesApi = {
  async send(input: SendMessageInput) {
    const { data } = await apiClient.post<ApiSuccess<Message>>("/messages", input)
    return data.data
  },

  async listConversations() {
    const { data } = await apiClient.get<ApiSuccess<Conversation[]>>(
      "/messages/conversations",
    )
    return data.data
  },

  async getConversation(otherUserId: string) {
    const { data } = await apiClient.get<ApiSuccess<ConversationThread>>(
      `/messages/conversations/${otherUserId}`,
    )
    return data.data
  },
}
