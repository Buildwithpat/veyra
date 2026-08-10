import { z } from "zod"

import { shippingSchema } from "@/features/orders/schemas"

export const createRfqSchema = z.object({
  categorySlug: z.string().min(1, "Choose a category"),
  title: z.string().min(3, "Give your RFQ a short title").max(200),
  description: z
    .string()
    .min(10, "Describe what you need in a bit more detail")
    .max(1000),
  quantity: z.coerce.number().positive("Enter a quantity"),
  unit: z.enum(["meter", "yard", "kg"]),
  targetPriceMax: z
    .union([z.literal(""), z.coerce.number().positive()])
    .optional()
    .transform((v) => (v === "" || v === undefined ? undefined : v)),
  deadline: z.string().optional(),
})

// The schema narrows targetPriceMax from the raw input type ("" allowed, to
// represent a cleared number input) to the transformed output type (undefined
// instead of ""), so the form's field values and its submit handler's values
// need two distinct types, wired together via useForm's third generic.
export type CreateRfqFormInput = z.input<typeof createRfqSchema>
export type CreateRfqFormValues = z.output<typeof createRfqSchema>

export const submitRfqResponseSchema = z.object({
  pricePerUnit: z.coerce.number().positive("Enter a price per unit"),
  moq: z.coerce.number().int().positive("Enter a minimum order quantity"),
  leadTimeDays: z.coerce.number().int().nonnegative("Enter lead time in days"),
  note: z.string().max(500, "Keep your note under 500 characters").optional(),
})

export type SubmitRfqResponseFormValues = z.infer<typeof submitRfqResponseSchema>

export const acceptRfqResponseSchema = shippingSchema

export type AcceptRfqResponseFormValues = z.infer<typeof acceptRfqResponseSchema>
