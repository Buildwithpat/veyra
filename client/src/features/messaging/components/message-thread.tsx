import { useState } from "react"
import { AlertTriangle, Send } from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { useConversation } from "@/features/messaging/hooks/use-conversation"
import { useSendMessage } from "@/features/messaging/hooks/use-send-message"
import { formatRelativeTime } from "@/features/messaging/lib/format-relative-time"
import { cn } from "@/lib/utils"

interface MessageThreadProps {
  otherUserId: string
  otherUserName: string
}

function ThreadSkeleton() {
  return (
    <div className="flex flex-col gap-3 p-4">
      <Skeleton className="ml-auto h-10 w-2/3 rounded-lg" />
      <Skeleton className="h-10 w-1/2 rounded-lg" />
      <Skeleton className="ml-auto h-10 w-1/3 rounded-lg" />
    </div>
  )
}

export function MessageThread({ otherUserId, otherUserName }: MessageThreadProps) {
  const { user } = useAuth()
  const [draft, setDraft] = useState("")
  const { data, isPending, isError, refetch } = useConversation(otherUserId)
  const sendMessage = useSendMessage()

  function handleSend() {
    const body = draft.trim()
    if (!body) return

    sendMessage.mutate(
      { recipientId: otherUserId, body },
      { onSuccess: () => setDraft("") },
    )
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-border/60 border-b px-4 py-3">
        <p className="text-foreground text-sm font-medium">{otherUserName}</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isPending ? (
          <ThreadSkeleton />
        ) : isError ? (
          <EmptyState
            icon={AlertTriangle}
            title="Couldn't load this conversation"
            description="Something went wrong reaching the server."
            actionLabel="Retry"
            onAction={() => refetch()}
          />
        ) : data.messages.length === 0 ? (
          <EmptyState
            title="No messages yet"
            description="No messages yet — say hello."
          />
        ) : (
          <div className="flex flex-col gap-2.5 p-4">
            {data.messages.map((message) => {
              const isMine = message.senderId === user?.id
              return (
                <div
                  key={message.id}
                  className={cn("flex flex-col", isMine ? "items-end" : "items-start")}
                >
                  <div
                    className={cn(
                      "max-w-[75%] rounded-lg px-3 py-2 text-sm",
                      isMine
                        ? "bg-primary text-primary-foreground"
                        : "bg-accent text-foreground",
                    )}
                  >
                    {message.productName && (
                      <p className="mb-1 text-xs font-medium opacity-80">
                        Re: {message.productName}
                      </p>
                    )}
                    {message.body}
                  </div>
                  <span className="text-muted-foreground mt-1 text-[11px]">
                    {formatRelativeTime(message.createdAt)}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="border-border/60 flex items-end gap-2 border-t p-3">
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write a message..."
          className="min-h-10 flex-1 resize-none"
          rows={1}
        />
        <Button
          size="icon"
          onClick={handleSend}
          disabled={!draft.trim() || sendMessage.isPending}
        >
          <Send className="size-4" />
          <span className="sr-only">Send</span>
        </Button>
      </div>
    </div>
  )
}
