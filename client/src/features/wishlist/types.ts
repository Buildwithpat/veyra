import type { Product } from "@/features/marketplace/types"

export type WishlistedProduct = Product & { savedAt: string }
