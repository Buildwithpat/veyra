import { z } from "zod"

export const supplierProfileSchema = z.object({
  businessName: z.string().min(2, "Enter your business name").max(150),
  description: z.string().min(10, "Business description must be at least 10 characters").max(2000),
  phone: z.string().min(6, "Enter a valid phone number").max(30),
  addressLine1: z.string().min(3, "Enter a street address").max(200),
  addressLine2: z.string().max(200).optional(),
  city: z.string().min(1, "Enter a city").max(100),
  state: z.string().min(1, "Enter a state or province").max(100),
  postalCode: z.string().min(1, "Enter a postal code").max(20),
  country: z.string().min(1, "Enter a country").max(100),
  operatingHours: z.string().min(1, "Enter your operating hours").max(200),
  categories: z.array(z.string()).min(1, "Select at least one fabric category"),
  defaultMoq: z.coerce.number().int().positive("Enter a positive MOQ"),
})

export type SupplierProfileFormValues = z.infer<typeof supplierProfileSchema>

export const productSchema = z.object({
  name: z.string().min(2, "Enter a product name").max(150),
  categoryId: z.string().min(1, "Select a category"),
  fabricType: z.string().min(1, "Enter a fabric type").max(100),
  color: z.string().min(1, "Enter a color name").max(100),
  colorHex: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Enter a valid hex color, e.g. #1C1C1E"),
  composition: z.string().min(1, "Enter the fiber composition").max(200),
  weightGsm: z.coerce.number().positive("Enter a positive weight"),
  widthCm: z.coerce.number().positive("Enter a positive width"),
  pricePerUnit: z.coerce.number().positive("Enter a positive price"),
  unit: z.enum(["meter", "yard", "kg"]),
  moq: z.coerce.number().int().positive("Enter a positive MOQ"),
  availability: z.enum(["in-stock", "limited", "made-to-order"]),
  leadTimeDays: z.coerce.number().int().nonnegative("Enter lead time in days"),
  description: z.string().min(10, "Description must be at least 10 characters").max(2000),
  tags: z.array(z.string()),
  isActive: z.boolean(),
})

export type ProductFormValues = z.infer<typeof productSchema>
