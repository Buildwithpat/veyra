export function bucketByDay<T>(
  items: T[],
  getDate: (item: T) => string | Date,
  days: number,
  getValue: (item: T) => number = () => 1,
): number[] {
  const buckets = Array(days).fill(0) as number[]
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (const item of items) {
    const d = new Date(getDate(item))
    d.setHours(0, 0, 0, 0)
    const diffDays = Math.round((today.getTime() - d.getTime()) / 86_400_000)
    const bucketIndex = days - 1 - diffDays
    if (bucketIndex >= 0 && bucketIndex < days) {
      buckets[bucketIndex] += getValue(item)
    }
  }

  return buckets
}

/** % change between the first half and second half of a bucketed series. Null when there isn't enough signal to compare. */
export function periodDelta(values: number[]): number | null {
  if (values.length < 2) return null
  const mid = Math.floor(values.length / 2)
  const previous = values.slice(0, mid).reduce((sum, v) => sum + v, 0)
  const current = values.slice(mid).reduce((sum, v) => sum + v, 0)
  if (previous === 0) return current > 0 ? 100 : null
  return Math.round(((current - previous) / previous) * 100)
}
