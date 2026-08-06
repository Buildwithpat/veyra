import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { useDocumentTitle } from "@/hooks/use-document-title"

export function NotFoundPage() {
  useDocumentTitle("Page not found")
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 text-center">
      <p className="text-muted-foreground text-sm font-medium">404</p>
      <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
      <p className="text-muted-foreground max-w-sm text-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Button asChild size="sm" className="mt-2">
        <Link to="/">Back to home</Link>
      </Button>
    </div>
  )
}
