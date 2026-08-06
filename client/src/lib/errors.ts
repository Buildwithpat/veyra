import axios from "axios"

/** Extracts the API's own error message when present, since our backend
 * returns actionable text (e.g. "X is no longer available") that's more
 * useful than a generic fallback. */
export function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const message = (error.response?.data as { message?: string } | undefined)?.message
    if (message) return message
  }
  return fallback
}
