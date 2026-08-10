import { AlertTriangle, MessageCircle } from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { useConversations } from "@/features/messaging/hooks/use-conversations"
import { formatRelativeTime } from "@/features/messaging/lib/format-relative-time"
import { getInitials } from "@/lib/initials"
import { cn } from "@/lib/utils"

interface ConversationListProps {
  selectedUserId?: string
  onSelect: (userId: string, name: string) => void
}

function ConversationListSkeleton() {
  return (
    <div className="flex flex-col gap-2 p-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full rounded-lg" />
      ))}
    </div>
  )
}

export function ConversationList({ selectedUserId, onSelect }: ConversationListProps) {
  const { data: conversations, isPending, isError, refetch } = useConversations()

  if (isPending) return <ConversationListSkeleton />

  if (isError) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="Couldn't load conversations"
        description="Something went wrong reaching the server."
        actionLabel="Retry"
        onAction={() => refetch()}
      />
    )
  }

  if (conversations.length === 0) {
    return (
      <EmptyState
        icon={MessageCircle}
        title="No conversations yet"
        description="Messages with buyers and suppliers will show up here."
      />
    )
  }

  return (
    <div className="flex flex-col gap-1 p-2">
      {conversations.map((conversation) => (
        <button
          key={conversation.otherUserId}
          type="button"
          onClick={() => onSelect(conversation.otherUserId, conversation.otherUserName)}
          className={cn(
            "flex items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
            selectedUserId === conversation.otherUserId
              ? "bg-accent"
              : "hover:bg-accent/60",
          )}
        >
          <Avatar>
            <AvatarFallback>{getInitials(conversation.otherUserName)}</AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-foreground truncate text-sm font-medium">
                {conversation.otherUserName}
              </p>
              <span className="text-muted-foreground shrink-0 text-xs">
                {formatRelativeTime(conversation.lastMessageAt)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <p className="text-muted-foreground truncate text-xs">
                {conversation.productName
                  ? `Re: ${conversation.productName} — ${conversation.lastMessageBody}`
                  : conversation.lastMessageBody}
              </p>
              {conversation.unreadCount > 0 && (
                <span className="bg-primary text-primary-foreground shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold">
                  {conversation.unreadCount}
                </span>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
