import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { messagesApi } from "@/features/messaging/api/messages-api"
import { getErrorMessage } from "@/lib/errors"

export function useSendMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: messagesApi.send,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] })
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Could not send message. Try again."))
    },
  })
}
