/** Short relative timestamp for chat UIs (e.g. "3m", "2h", "5d"). Falls back
 * to a plain date once it's far enough in the past that "relative" stops
 * being useful. */
export function formatRelativeTime(iso: string) {
  const date = new Date(iso)
  const diffMs = Date.now() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)

  if (diffMin < 1) return "now"
  if (diffMin < 60) return `${diffMin}m`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h`
  const diffDay = Math.floor(diffHr / 24)
  if (diffDay < 7) return `${diffDay}d`

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}
