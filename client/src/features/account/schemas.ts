import { z } from "zod"

import { strongPassword } from "@/lib/password-schema"

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: strongPassword,
    confirmPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>

export const buyerProfileSchema = z.object({
  businessType: z.string().min(1, "Select a business type"),
  industry: z.string().min(1, "Select an industry"),
  interests: z.array(z.string()).min(1, "Select at least one interest"),
  preferredFabrics: z.array(z.string()).min(1, "Select at least one fabric category"),
  budgetRange: z.string().min(1, "Select a budget range"),
  moqPreference: z.string().min(1, "Select an MOQ preference"),
})

export type BuyerProfileFormValues = z.infer<typeof buyerProfileSchema>
