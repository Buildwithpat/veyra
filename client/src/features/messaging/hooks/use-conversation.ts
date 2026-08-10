import { useQuery } from "@tanstack/react-query"

import { messagesApi } from "@/features/messaging/api/messages-api"

export function useConversation(otherUserId: string | undefined) {
  return useQuery({
    queryKey: ["messages", "conversation", otherUserId],
    queryFn: () => messagesApi.getConversation(otherUserId!),
    enabled: !!otherUserId,
  })
}
