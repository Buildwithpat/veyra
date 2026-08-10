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
import { shippingSchema, type ShippingFormValues } from "@/features/orders/schemas"
import { useAcceptRfqResponse } from "@/features/rfq/hooks/use-accept-rfq-response"
import type { RfqResponse } from "@/features/rfq/types"

interface AcceptQuoteDialogProps {
  rfqId: string
  response: RfqResponse
  open: boolean
  onOpenChange: (open: boolean) => void
  onAccepted: (orderId: string) => void
}

export function AcceptQuoteDialog({
  rfqId,
  response,
  open,
  onOpenChange,
  onAccepted,
}: AcceptQuoteDialogProps) {
  const acceptRfqResponse = useAcceptRfqResponse()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ShippingFormValues>({ resolver: zodResolver(shippingSchema) })

  function handleOpenChange(next: boolean) {
    if (!next) reset()
    onOpenChange(next)
  }

  async function onSubmit(values: ShippingFormValues) {
    try {
      const order = await acceptRfqResponse.mutateAsync({
        rfqId,
        responseId: response.id,
        shipping: values,
      })
      handleOpenChange(false)
      onAccepted(order.id)
    } catch {
      // toast is handled by the mutation's onError
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Accept quote from {response.supplierName}</DialogTitle>
          <DialogDescription>
            Confirm a shipping address to place the order at{" "}
            {response.pricePerUnit.toFixed(2)} per unit.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="accept-fullName">Recipient name</Label>
              <Input id="accept-fullName" {...register("fullName")} />
              {errors.fullName && (
                <p className="text-destructive text-xs">{errors.fullName.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="accept-phone">Phone</Label>
              <Input id="accept-phone" type="tel" {...register("phone")} />
              {errors.phone && (
                <p className="text-destructive text-xs">{errors.phone.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="accept-addressLine1">Address line 1</Label>
              <Input id="accept-addressLine1" {...register("addressLine1")} />
              {errors.addressLine1 && (
                <p className="text-destructive text-xs">
                  {errors.addressLine1.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="accept-addressLine2">Address line 2 (optional)</Label>
              <Input id="accept-addressLine2" {...register("addressLine2")} />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="accept-city">City</Label>
              <Input id="accept-city" {...register("city")} />
              {errors.city && (
                <p className="text-destructive text-xs">{errors.city.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="accept-state">State / Province</Label>
              <Input id="accept-state" {...register("state")} />
              {errors.state && (
                <p className="text-destructive text-xs">{errors.state.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="accept-postalCode">Postal code</Label>
              <Input id="accept-postalCode" {...register("postalCode")} />
              {errors.postalCode && (
                <p className="text-destructive text-xs">{errors.postalCode.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="accept-country">Country</Label>
              <Input id="accept-country" {...register("country")} />
              {errors.country && (
                <p className="text-destructive text-xs">{errors.country.message}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={acceptRfqResponse.isPending}>
              {acceptRfqResponse.isPending ? "Placing order..." : "Accept & place order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
