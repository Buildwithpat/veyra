import { VeyraAiIcon } from "@/components/shared/veyra-ai-icon"
import { Button } from "@/components/ui/button"
import { useAssistantPanel } from "@/features/assistant/hooks/use-assistant-panel"

export function AssistantTrigger() {
  const { openAssistant } = useAssistantPanel()

  return (
    <Button
      onClick={() => openAssistant()}
      size="icon"
      className="fixed right-6 bottom-6 z-40 size-12 rounded-full shadow-lg ring-4 ring-primary/10 transition-transform hover:scale-105 hover:shadow-xl active:scale-95"
    >
      <VeyraAiIcon className="size-5" />
      <span className="sr-only">Open Veyra Assistant</span>
    </Button>
  )
}
