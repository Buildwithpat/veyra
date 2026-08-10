import { useSearchParams } from "react-router-dom"
import { ArrowLeft, MessageCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ConversationList } from "@/features/messaging/components/conversation-list"
import { MessageThread } from "@/features/messaging/components/message-thread"
import { useDocumentTitle } from "@/hooks/use-document-title"

export function DashboardMessagesPage() {
  useDocumentTitle("Messages")
  const [searchParams, setSearchParams] = useSearchParams()

  const selectedUserId = searchParams.get("with") ?? undefined
  const selectedName = searchParams.get("name") ?? ""

  function handleSelect(userId: string, name: string) {
    setSearchParams({ with: userId, name })
  }

  function handleBack() {
    setSearchParams({})
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4 md:h-[calc(100vh-6rem)]">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Messages</h1>
        <p className="text-muted-foreground text-sm">
          Conversations with buyers and suppliers.
        </p>
      </div>

      <div className="border-border/60 flex min-h-0 flex-1 overflow-hidden rounded-xl border">
        <div
          className={
            selectedUserId
              ? "hidden w-1/3 shrink-0 overflow-y-auto border-r md:block border-border/60"
              : "w-full overflow-y-auto md:block md:w-1/3 md:shrink-0 md:border-r border-border/60"
          }
        >
          <ConversationList selectedUserId={selectedUserId} onSelect={handleSelect} />
        </div>

        <div
          className={
            selectedUserId ? "flex min-h-0 w-full flex-1 flex-col" : "hidden flex-1 md:flex"
          }
        >
          {selectedUserId ? (
            <>
              <div className="border-border/60 flex items-center gap-2 border-b p-2 md:hidden">
                <Button variant="ghost" size="icon" onClick={handleBack}>
                  <ArrowLeft className="size-4" />
                  <span className="sr-only">Back to conversations</span>
                </Button>
              </div>
              <div className="min-h-0 flex-1">
                <MessageThread otherUserId={selectedUserId} otherUserName={selectedName} />
              </div>
            </>
          ) : (
            <div className="hidden flex-1 flex-col items-center justify-center gap-2 md:flex">
              <MessageCircle className="text-muted-foreground size-8" />
              <p className="text-muted-foreground text-sm">
                Select a conversation to view messages.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
