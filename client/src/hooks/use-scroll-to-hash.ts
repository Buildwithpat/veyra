import { useEffect } from "react"
import { useLocation } from "react-router-dom"

// Matches the fixed navbar height (`pt-[4.5rem]` on <main>) plus breathing room.
const NAV_OFFSET = 88

/**
 * React Router's <Link> never triggers the browser's native anchor-scroll —
 * that only happens on a real full-page navigation. Without this, clicking
 * "How it works" / "FAQ" just changes the URL hash and nothing moves.
 *
 * The target section can also not exist in the DOM yet (navigating from
 * another route mounts the landing page fresh, and its sections render
 * after data hooks resolve), so this retries across a few animation frames
 * instead of scrolling once and giving up — which is what made the old
 * behavior feel like it "sometimes" worked.
 */
export function useScrollToHash() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) return
    const id = hash.slice(1)

    let cancelled = false
    let attempts = 0

    function tryScroll() {
      if (cancelled) return
      const el = document.getElementById(id)
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET
        window.scrollTo({ top, behavior: "smooth" })
        return
      }
      attempts += 1
      if (attempts < 30) requestAnimationFrame(tryScroll)
    }

    tryScroll()
    return () => {
      cancelled = true
    }
  }, [pathname, hash])
}
