import { useQuery } from "@tanstack/react-query"

import { messagesApi } from "@/features/messaging/api/messages-api"

export function useConversations() {
  return useQuery({
    queryKey: ["messages", "conversations"],
    queryFn: messagesApi.listConversations,
    refetchInterval: 15000,
  })
}
