import { useEffect, useRef } from "react"

export function useInfiniteScrollTrigger(onIntersect: () => void, enabled: boolean) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!enabled || !node) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onIntersect()
      },
      { rootMargin: "400px" },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [onIntersect, enabled])

  return ref
}
