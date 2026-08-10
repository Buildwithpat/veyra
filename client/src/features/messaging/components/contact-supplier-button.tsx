import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { useSendMessage } from "@/features/messaging/hooks/use-send-message"

interface ContactSupplierButtonProps {
  supplierId: string
  supplierName: string
  productId?: string
  productName?: string
}

export function ContactSupplierButton({
  supplierId,
  supplierName,
  productId,
  productName,
}: ContactSupplierButtonProps) {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [body, setBody] = useState("")
  const sendMessage = useSendMessage()

  function handleOpenChange(next: boolean) {
    if (next && !isAuthenticated) {
      navigate("/login")
      return
    }
    setOpen(next)
    if (!next) setBody("")
  }

  function handleSend() {
    const trimmed = body.trim()
    if (!trimmed) return

    sendMessage.mutate(
      { recipientId: supplierId, body: trimmed, productId },
      {
        onSuccess: () => {
          setOpen(false)
          setBody("")
          toast.success(`Message sent to ${supplierName}`)
        },
      },
    )
  }

  return (
    <>
      <Button
        variant="outline"
        size="lg"
        className="w-full"
        onClick={() => handleOpenChange(true)}
      >
        Contact supplier
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Message {supplierName}</DialogTitle>
          </DialogHeader>

          {productName && (
            <p className="text-muted-foreground -mt-1 text-sm">Re: {productName}</p>
          )}

          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={`Ask ${supplierName} about this product...`}
            className="min-h-28"
            autoFocus
          />

          <DialogFooter>
            <Button
              onClick={handleSend}
              disabled={!body.trim() || sendMessage.isPending}
            >
              {sendMessage.isPending ? "Sending..." : "Send"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
