import { z } from "zod"

/** Enforced wherever a user sets a brand-new password (register, change
 * password) — not on login, since existing passwords predate this rule. */
export const strongPassword = z
  .string()
  .min(8, "At least 8 characters")
  .regex(/[a-z]/, "One lowercase letter")
  .regex(/[A-Z]/, "One uppercase letter")
  .regex(/[0-9]/, "One number")
  .regex(/[^A-Za-z0-9]/, "One symbol")
