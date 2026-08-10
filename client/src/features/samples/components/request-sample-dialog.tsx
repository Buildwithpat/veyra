import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCreateSampleRequest } from "@/features/samples/hooks/use-create-sample-request"
import { requestSampleSchema, type RequestSampleFormValues } from "@/features/samples/schemas"
import type { Product } from "@/features/marketplace/types"

interface RequestSampleDialogProps {
  product: Product
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RequestSampleDialog({
  product,
  open,
  onOpenChange,
}: RequestSampleDialogProps) {
  const createSampleRequest = useCreateSampleRequest()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RequestSampleFormValues>({ resolver: zodResolver(requestSampleSchema) })

  function handleOpenChange(next: boolean) {
    if (!next) reset()
    onOpenChange(next)
  }

  async function onSubmit(values: RequestSampleFormValues) {
    try {
      await createSampleRequest.mutateAsync({
        productId: product.id,
        note: values.note,
        shippingAddress: values.shipping,
      })
      handleOpenChange(false)
    } catch {
      // toast is handled by the mutation's onError
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Request a sample</DialogTitle>
          <DialogDescription>
            We&apos;ll send your request to {product.supplier.name} for a physical swatch
            of {product.name}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="sample-note">Note to supplier (optional)</Label>
            <Textarea
              id="sample-note"
              placeholder="e.g. need to check drape and colorfastness"
              {...register("note")}
            />
            {errors.note && (
              <p className="text-destructive text-xs">{errors.note.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="sample-fullName">Recipient name</Label>
              <Input id="sample-fullName" {...register("shipping.fullName")} />
              {errors.shipping?.fullName && (
                <p className="text-destructive text-xs">
                  {errors.shipping.fullName.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="sample-phone">Phone</Label>
              <Input id="sample-phone" type="tel" {...register("shipping.phone")} />
              {errors.shipping?.phone && (
                <p className="text-destructive text-xs">{errors.shipping.phone.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="sample-addressLine1">Address line 1</Label>
              <Input id="sample-addressLine1" {...register("shipping.addressLine1")} />
              {errors.shipping?.addressLine1 && (
                <p className="text-destructive text-xs">
                  {errors.shipping.addressLine1.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="sample-addressLine2">Address line 2 (optional)</Label>
              <Input id="sample-addressLine2" {...register("shipping.addressLine2")} />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="sample-city">City</Label>
              <Input id="sample-city" {...register("shipping.city")} />
              {errors.shipping?.city && (
                <p className="text-destructive text-xs">{errors.shipping.city.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="sample-state">State / Province</Label>
              <Input id="sample-state" {...register("shipping.state")} />
              {errors.shipping?.state && (
                <p className="text-destructive text-xs">{errors.shipping.state.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="sample-postalCode">Postal code</Label>
              <Input id="sample-postalCode" {...register("shipping.postalCode")} />
              {errors.shipping?.postalCode && (
                <p className="text-destructive text-xs">
                  {errors.shipping.postalCode.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="sample-country">Country</Label>
              <Input id="sample-country" {...register("shipping.country")} />
              {errors.shipping?.country && (
                <p className="text-destructive text-xs">
                  {errors.shipping.country.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createSampleRequest.isPending}>
              {createSampleRequest.isPending ? "Sending..." : "Send request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
