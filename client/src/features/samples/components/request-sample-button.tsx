import { useState } from "react"
import { Beaker } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { RequestSampleDialog } from "@/features/samples/components/request-sample-dialog"
import type { Product } from "@/features/marketplace/types"

export function RequestSampleButton({ product }: { product: Product }) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)

  if (user?.role !== "buyer") return null

  return (
    <>
      <Button
        variant="outline"
        size="lg"
        className="w-full gap-2"
        onClick={() => setOpen(true)}
      >
        <Beaker className="size-4" />
        Request a sample
      </Button>
      <RequestSampleDialog product={product} open={open} onOpenChange={setOpen} />
    </>
  )
}
