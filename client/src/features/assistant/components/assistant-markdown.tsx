import type { ReactNode } from "react"

/**
 * Turns the assistant's raw text (which may contain lightweight Markdown —
 * **bold**, `code`, _italic_, "1. " / "- " lists — from either the
 * deterministic template or a real LLM provider) into clean typography with
 * no visible Markdown syntax. Deliberately hand-rolled rather than a
 * dependency: the assistant's output is a small, known subset of Markdown,
 * and this keeps full control over how it reads inside a chat bubble
 * (numbered results as badges, not raw "1."), including mid-stream when a
 * line hasn't fully arrived yet.
 */

const INLINE_PATTERN = /\*\*(.+?)\*\*|`([^`]+?)`|_(.+?)_/g

function parseInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  let i = 0

  INLINE_PATTERN.lastIndex = 0
  while ((match = INLINE_PATTERN.exec(text))) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }
    const key = `${keyPrefix}-${i++}`
    if (match[1] !== undefined) {
      nodes.push(
        <strong key={key} className="font-semibold text-foreground">
          {match[1]}
        </strong>,
      )
    } else if (match[2] !== undefined) {
      nodes.push(
        <code
          key={key}
          className="rounded-md bg-primary/10 px-1.5 py-0.5 font-mono text-[0.85em] text-primary"
        >
          {match[2]}
        </code>,
      )
    } else if (match[3] !== undefined) {
      nodes.push(
        <em key={key} className="text-foreground italic">
          {match[3]}
        </em>,
      )
    }
    lastIndex = INLINE_PATTERN.lastIndex
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex))
  return nodes
}

type Block =
  | { type: "paragraph"; lines: string[] }
  | { type: "heading"; text: string }
  | { type: "ol"; items: string[] }
  | { type: "ul"; items: string[] }

function parseBlocks(content: string): Block[] {
  const blocks: Block[] = []
  let current: Block | null = null

  for (const raw of content.split("\n")) {
    const line = raw.trim()

    if (line === "") {
      current = null
      continue
    }

    const heading = /^#{1,3}\s+(.*)/.exec(line)
    if (heading) {
      blocks.push({ type: "heading", text: heading[1] })
      current = null
      continue
    }

    const ordered = /^\d+\.\s+(.*)/.exec(line)
    if (ordered) {
      if (current?.type === "ol") current.items.push(ordered[1])
      else {
        current = { type: "ol", items: [ordered[1]] }
        blocks.push(current)
      }
      continue
    }

    const bulleted = /^[-*]\s+(.*)/.exec(line)
    if (bulleted) {
      if (current?.type === "ul") current.items.push(bulleted[1])
      else {
        current = { type: "ul", items: [bulleted[1]] }
        blocks.push(current)
      }
      continue
    }

    if (current?.type === "paragraph") current.lines.push(line)
    else {
      current = { type: "paragraph", lines: [line] }
      blocks.push(current)
    }
  }

  return blocks
}

export function AssistantMarkdown({ content }: { content: string }) {
  const blocks = parseBlocks(content)

  return (
    <div className="flex flex-col gap-3">
      {blocks.map((block, bi) => {
        const key = `b-${bi}`

        if (block.type === "heading") {
          return (
            <p key={key} className="text-sm font-semibold text-foreground">
              {parseInline(block.text, key)}
            </p>
          )
        }

        if (block.type === "ol") {
          return (
            <ol key={key} className="flex list-none flex-col gap-2">
              {block.items.map((item, li) => (
                <li key={li} className="flex gap-2.5">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                    {li + 1}
                  </span>
                  <span className="flex-1 text-sm leading-relaxed text-foreground">
                    {parseInline(item, `${key}-${li}`)}
                  </span>
                </li>
              ))}
            </ol>
          )
        }

        if (block.type === "ul") {
          return (
            <ul key={key} className="flex list-none flex-col gap-2">
              {block.items.map((item, li) => (
                <li key={li} className="flex gap-2.5">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/50" />
                  <span className="flex-1 text-sm leading-relaxed text-foreground">
                    {parseInline(item, `${key}-${li}`)}
                  </span>
                </li>
              ))}
            </ul>
          )
        }

        return (
          <p key={key} className="text-sm leading-relaxed text-foreground">
            {block.lines.map((line, li) => (
              <span key={li}>
                {parseInline(line, `${key}-${li}`)}
                {li < block.lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        )
      })}
    </div>
  )
}
