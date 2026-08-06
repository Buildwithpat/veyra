import { Outlet } from "react-router-dom"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { AssistantTrigger } from "@/features/assistant/components/assistant-trigger"
import { useScrollToHash } from "@/hooks/use-scroll-to-hash"

export function PublicLayout() {
  useScrollToHash()

  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <main className="flex-1 pt-[4.5rem]">
        <Outlet />
      </main>
      <Footer />
      <AssistantTrigger />
    </div>
  )
}
