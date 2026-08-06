import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/features/cart/hooks/use-cart"
import { useCreateOrder } from "@/features/orders/hooks/use-create-order"
import { shippingSchema, type ShippingFormValues } from "@/features/orders/schemas"
import { countryCodes } from "@/lib/country-codes"
import { getErrorMessage } from "@/lib/errors"
import { formatPrice } from "@/lib/format"
import { useDocumentTitle } from "@/hooks/use-document-title"

const STALE_ITEM_PATTERN = /^"(.+)" is no longer available$/

function combinePhone(code: string, number: string) {
  return number.trim() ? `${code} ${number.trim()}` : ""
}

export function CheckoutPage() {
  useDocumentTitle("Checkout")
  const { items, subtotal, clear, removeItem } = useCart()
  const navigate = useNavigate()
  const createOrder = useCreateOrder()
  const [phoneCountry, setPhoneCountry] = useState(countryCodes[0]!.country)
  const [phoneNumber, setPhoneNumber] = useState("")

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingFormValues>({ resolver: zodResolver(shippingSchema) })

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20">
        <EmptyState
          title="Your cart is empty"
          description="Add fabrics to your cart before checking out."
          actionLabel="Browse marketplace"
          onAction={() => navigate("/marketplace")}
        />
      </div>
    )
  }

  async function onSubmit(shipping: ShippingFormValues) {
    const orderItems = items.map((item) => ({
      productId: item.productId,
      slug: item.slug,
      name: item.name,
      fabricType: item.fabricType,
      color: item.color,
      colorHex: item.colorHex,
      supplierId: item.supplierId,
      supplierName: item.supplierName,
      pricePerUnit: item.pricePerUnit,
      unit: item.unit,
      quantity: item.quantity,
      subtotal: item.quantity * item.pricePerUnit,
    }))

    try {
      const order = await createOrder.mutateAsync({ items: orderItems, shipping })
      clear()
      toast.success("Order placed")
      navigate(`/dashboard/orders/${order.id}`, { replace: true })
    } catch (error) {
      const message = getErrorMessage(error, "Could not place your order. Try again.")

      // A cart can go stale if the catalog was reseeded after the item was
      // added — drop that one item instead of leaving the buyer stuck on a
      // checkout that will fail the same way every time they retry.
      const staleName = message.match(STALE_ITEM_PATTERN)?.[1]
      const staleItem = staleName ? items.find((item) => item.name === staleName) : undefined
      if (staleItem) removeItem(staleItem.productId)

      toast.error(message)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3"
      >
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Shipping information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor="fullName">Recipient name</Label>
                <Input id="fullName" {...register("fullName")} />
                {errors.fullName && (
                  <p className="text-destructive text-xs">{errors.fullName.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor="phone">Phone</Label>
                <Controller
                  control={control}
                  name="phone"
                  render={({ field }) => (
                    <div className="grid grid-cols-[5.5rem_1fr] gap-2">
                      <Select
                        value={phoneCountry}
                        onValueChange={(country) => {
                          setPhoneCountry(country)
                          const code = countryCodes.find((c) => c.country === country)?.code ?? ""
                          field.onChange(combinePhone(code, phoneNumber))
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {countryCodes.map((c) => (
                            <SelectItem key={c.country} value={c.country}>
                              <span className="font-medium">{c.iso2}</span>
                              <span className="text-muted-foreground ml-1.5">{c.code}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="98765 43210"
                        value={phoneNumber}
                        onChange={(e) => {
                          setPhoneNumber(e.target.value)
                          const code =
                            countryCodes.find((c) => c.country === phoneCountry)?.code ?? ""
                          field.onChange(combinePhone(code, e.target.value))
                        }}
                      />
                    </div>
                  )}
                />
                {errors.phone && (
                  <p className="text-destructive text-xs">{errors.phone.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor="addressLine1">Address line 1</Label>
                <Input id="addressLine1" {...register("addressLine1")} />
                {errors.addressLine1 && (
                  <p className="text-destructive text-xs">
                    {errors.addressLine1.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor="addressLine2">Address line 2 (optional)</Label>
                <Input id="addressLine2" {...register("addressLine2")} />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" {...register("city")} />
                {errors.city && (
                  <p className="text-destructive text-xs">{errors.city.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="state">State / Province</Label>
                <Input id="state" {...register("state")} />
                {errors.state && (
                  <p className="text-destructive text-xs">{errors.state.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="postalCode">Postal code</Label>
                <Input id="postalCode" {...register("postalCode")} />
                {errors.postalCode && (
                  <p className="text-destructive text-xs">{errors.postalCode.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" {...register("country")} />
                {errors.country && (
                  <p className="text-destructive text-xs">{errors.country.message}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit lg:sticky lg:top-24">
          <CardHeader>
            <CardTitle className="text-base">Order summary</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2.5">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between gap-3 text-sm">
                  <span className="text-muted-foreground truncate">
                    {item.name} &times; {item.quantity}
                  </span>
                  <span className="text-foreground shrink-0 font-medium">
                    {formatPrice(item.quantity * item.pricePerUnit)}
                  </span>
                </div>
              ))}
            </div>

            <Separator />

            <div className="text-foreground flex justify-between text-sm font-semibold">
              <span>Total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={createOrder.isPending}
            >
              {createOrder.isPending ? "Placing order..." : "Place order"}
            </Button>

            <p className="text-muted-foreground text-center text-xs">
              This is a preview checkout &mdash; no payment is collected.
            </p>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
