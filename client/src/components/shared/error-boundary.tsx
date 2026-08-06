import { Component, type ReactNode } from "react"
import { RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    console.error("Unhandled application error:", error)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-foreground text-xl font-semibold tracking-tight">
          Something went wrong
        </h1>
        <p className="text-muted-foreground max-w-sm text-sm">
          We hit an unexpected error. Reloading the page usually fixes it.
        </p>
        <Button onClick={() => window.location.reload()} className="gap-2">
          <RefreshCw className="size-4" />
          Reload page
        </Button>
      </div>
    )
  }
}
