import { Outlet } from "react-router-dom"

import { AssistantProvider } from "@/features/assistant/assistant-provider"

/**
 * Wraps every route with providers that render router-dependent JSX (the
 * assistant panel uses <Link> for its source cards) — those providers must
 * live inside the router tree, not alongside it in App.tsx, or their output
 * has no router context.
 */
export function RootProviders() {
  return (
    <AssistantProvider>
      <Outlet />
    </AssistantProvider>
  )
}
