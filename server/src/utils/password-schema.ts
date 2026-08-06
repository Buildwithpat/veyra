import { z } from "zod"

/** Enforced wherever a user sets a brand-new password (register, change
 * password) — not on login, since existing passwords predate this rule. */
export const strongPassword = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[a-z]/, "Password must include a lowercase letter")
  .regex(/[A-Z]/, "Password must include an uppercase letter")
  .regex(/[0-9]/, "Password must include a number")
  .regex(/[^A-Za-z0-9]/, "Password must include a symbol")
