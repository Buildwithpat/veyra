import { useEffect, useRef, useState } from "react"

import { AppShellLoader } from "@/components/shell/app-shell-loader"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { useFeaturedProducts } from "@/features/marketplace/hooks/use-featured-products"
import { AppRouter } from "@/routes/router"

// Floor so the loader never flashes on a fast connection; must match the
// loader's own fade transition so the overlay finishes fading before unmount.
const MIN_VISIBLE_MS = 3000
const FADE_OUT_MS = 500

// Shown once per browser session — sessionStorage survives a refresh in the
// same tab (so reloading never replays it) but resets on a fresh visit.
const SESSION_KEY = "veyra-app-shell-seen"

function hasSeenSplash() {
  if (typeof sessionStorage === "undefined") return true
  return sessionStorage.getItem(SESSION_KEY) === "1"
}

function useFontsReady() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const fontSet = typeof document !== "undefined" ? document.fonts : undefined
    if (!fontSet) {
      setReady(true)
      return
    }
    let cancelled = false
    fontSet.ready.then(() => {
      if (!cancelled) setReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return ready
}

/**
 * Renders the real app immediately (so it's already painted underneath) and
 * overlays the boot loader on top of it, fading it out once auth, the
 * landing page's featured-product query, and web fonts have all settled.
 * The overlay unmounts only after its own fade completes — no pop, no
 * layout shift, since the page it reveals was already there.
 */
export function AppShell() {
  const { isLoading: authLoading } = useAuth()
  const { isPending: productsPending } = useFeaturedProducts()
  const fontsReady = useFontsReady()

  const skip = useRef(hasSeenSplash()).current
  const [minTimeElapsed, setMinTimeElapsed] = useState(skip)
  const [showLoader, setShowLoader] = useState(!skip)
  const fadeStarted = useRef(skip)

  useEffect(() => {
    if (skip) return
    const timer = setTimeout(() => setMinTimeElapsed(true), MIN_VISIBLE_MS)
    return () => clearTimeout(timer)
  }, [skip])

  const suppliersConnected = !authLoading
  const libraryLoaded = suppliersConnected && !productsPending
  const assistantReady = libraryLoaded && fontsReady
  const allReady = skip || (assistantReady && minTimeElapsed)

  useEffect(() => {
    if (!allReady || fadeStarted.current) return
    fadeStarted.current = true
    sessionStorage.setItem(SESSION_KEY, "1")
    const timer = setTimeout(() => setShowLoader(false), FADE_OUT_MS)
    return () => clearTimeout(timer)
  }, [allReady])

  const steps = [
    { label: "Connecting suppliers", done: suppliersConnected },
    { label: "Loading fabric library", done: libraryLoaded },
    { label: "Preparing AI assistant", done: assistantReady },
  ]

  return (
    <>
      <AppRouter />
      {showLoader ? <AppShellLoader steps={steps} visible={!allReady} /> : null}
    </>
  )
}
