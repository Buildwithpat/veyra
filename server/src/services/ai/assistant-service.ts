import type { PublicProduct } from "../../utils/serialize-product.js"
import {
  detectSendMessageCommand,
  executeSendMessageAction,
  sendMessageRequiresSignIn,
} from "./actions.js"
import { parseIntent } from "./intent.js"
import { buildMessages } from "./prompt.js"
import { getAiProvider } from "./providers/index.js"
import { retrieveProducts } from "./retrieval.js"
import {
  generateSuggestedPrompts,
  generateTemplateResponse,
} from "./template-response.js"
import type { AssistantContext, ChatMessage } from "./types.js"

export type AssistantStreamEvent =
  | { type: "chunk"; content: string }
  | {
      type: "done"
      sources: PublicProduct[]
      suggestedPrompts: string[]
      provider: string
    }

const TEMPLATE_WORD_DELAY_MS = 18

/**
 * The single orchestration path: parse intent → retrieve marketplace data →
 * generate a response (real LLM if configured, deterministic template
 * otherwise) → yield it as a stream of events. The SSE controller and any
 * future non-streaming caller both consume this same generator, so there's
 * exactly one place retrieval + generation logic lives.
 */
export async function* runAssistantStream(
  history: ChatMessage[],
  question: string,
  context?: AssistantContext,
  senderId?: string,
): AsyncGenerator<AssistantStreamEvent> {
  // "Send a message to X about Y: ..." is an action, not a question — resolve
  // and dispatch it directly rather than routing it through retrieval + the
  // LLM, since it needs an exact, verifiable outcome (a message either sent
  // or not), not a generated answer.
  const sendMessageCommand = detectSendMessageCommand(question)
  if (sendMessageCommand) {
    const result = senderId
      ? await executeSendMessageAction(sendMessageCommand, senderId)
      : sendMessageRequiresSignIn()

    for (const chunk of result.chunks) {
      yield { type: "chunk", content: chunk }
    }
    yield {
      type: "done",
      sources: result.sources,
      suggestedPrompts: [],
      provider: "action",
    }
    return
  }

  const intent = parseIntent(question)
  const sources = await retrieveProducts(intent, context)
  const provider = getAiProvider()

  if (provider?.stream) {
    for await (const chunk of provider.stream(
      buildMessages(history, question, sources),
    )) {
      yield { type: "chunk", content: chunk }
    }
  } else if (provider) {
    const content = await provider.complete(buildMessages(history, question, sources))
    yield { type: "chunk", content }
  } else {
    // No provider configured — fall back to a deterministic, data-grounded
    // response. Streamed word-by-word so the UI has one code path regardless
    // of whether a real LLM is behind it.
    const text = generateTemplateResponse(intent.action, question, sources)
    for (const word of text.split(" ")) {
      yield { type: "chunk", content: `${word} ` }
      await new Promise((resolve) => setTimeout(resolve, TEMPLATE_WORD_DELAY_MS))
    }
  }

  yield {
    type: "done",
    sources,
    suggestedPrompts: generateSuggestedPrompts(intent.action, sources),
    provider: provider?.name ?? "template",
  }
}
