import { z } from "zod"

export const shippingSchema = z.object({
  fullName: z.string().min(2, "Enter the recipient's full name").max(120),
  phone: z.string().min(6, "Enter a valid phone number").max(30),
  addressLine1: z.string().min(3, "Enter a street address").max(200),
  addressLine2: z.string().max(200).optional(),
  city: z.string().min(1, "Enter a city").max(100),
  state: z.string().min(1, "Enter a state or province").max(100),
  postalCode: z.string().min(1, "Enter a postal code").max(20),
  country: z.string().min(1, "Enter a country").max(100),
})

export type ShippingFormValues = z.infer<typeof shippingSchema>
