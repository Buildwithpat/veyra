import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useSubmitRfqResponse } from "@/features/rfq/hooks/use-submit-rfq-response"
import {
  submitRfqResponseSchema,
  type SubmitRfqResponseFormValues,
} from "@/features/rfq/schemas"
import type { OpenRfqForSupplier } from "@/features/rfq/types"

interface SubmitQuoteDialogProps {
  rfq: OpenRfqForSupplier
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SubmitQuoteDialog({ rfq, open, onOpenChange }: SubmitQuoteDialogProps) {
  const submitRfqResponse = useSubmitRfqResponse()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubmitRfqResponseFormValues>({
    resolver: zodResolver(submitRfqResponseSchema),
    defaultValues: { pricePerUnit: undefined, moq: undefined, leadTimeDays: undefined, note: "" },
  })

  function handleOpenChange(next: boolean) {
    if (!next) reset()
    onOpenChange(next)
  }

  async function onSubmit(values: SubmitRfqResponseFormValues) {
    try {
      await submitRfqResponse.mutateAsync({ rfqId: rfq.id, input: values })
      handleOpenChange(false)
    } catch {
      // toast is handled by the mutation's onError
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Submit a quote</DialogTitle>
          <DialogDescription>
            Quote your terms for &quot;{rfq.title}&quot; — {rfq.quantity} {rfq.unit}s.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="quote-price">Price / {rfq.unit}</Label>
              <Input
                id="quote-price"
                type="number"
                step="any"
                {...register("pricePerUnit")}
              />
              {errors.pricePerUnit && (
                <p className="text-destructive text-xs">{errors.pricePerUnit.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="quote-moq">MOQ</Label>
              <Input id="quote-moq" type="number" step="1" {...register("moq")} />
              {errors.moq && (
                <p className="text-destructive text-xs">{errors.moq.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="quote-leadTimeDays">Lead time (days)</Label>
            <Input
              id="quote-leadTimeDays"
              type="number"
              step="1"
              {...register("leadTimeDays")}
            />
            {errors.leadTimeDays && (
              <p className="text-destructive text-xs">{errors.leadTimeDays.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="quote-note">Note (optional)</Label>
            <Textarea
              id="quote-note"
              placeholder="Anything the buyer should know about this quote"
              {...register("note")}
            />
            {errors.note && (
              <p className="text-destructive text-xs">{errors.note.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitRfqResponse.isPending}>
              {submitRfqResponse.isPending ? "Submitting..." : "Submit quote"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
