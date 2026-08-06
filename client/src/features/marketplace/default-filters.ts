import type { ProductFilters } from "@/features/marketplace/types"

export const emptyProductFilters: ProductFilters = {
  search: "",
  categoryIds: [],
  colors: [],
  priceMin: null,
  priceMax: null,
  moqMax: null,
  availability: [],
}
