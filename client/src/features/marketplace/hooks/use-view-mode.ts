import { useEffect, useState } from "react"

import type { MarketplaceViewMode } from "@/features/marketplace/components/marketplace-product-card"

const STORAGE_KEY = "veyra-marketplace-view-mode"

function readStoredMode(): MarketplaceViewMode {
  if (typeof window === "undefined") return "large"
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === "large" || stored === "compact" || stored === "masonry") return stored
  return "large"
}

export function useViewMode() {
  const [viewMode, setViewModeState] = useState<MarketplaceViewMode>(readStoredMode)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, viewMode)
  }, [viewMode])

  return [viewMode, setViewModeState] as const
}
