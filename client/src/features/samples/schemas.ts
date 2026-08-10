import { z } from "zod"

import { shippingSchema } from "@/features/orders/schemas"

export const requestSampleSchema = z.object({
  note: z.string().max(300, "Keep your note under 300 characters").optional(),
  shipping: shippingSchema,
})

export type RequestSampleFormValues = z.infer<typeof requestSampleSchema>
