export type Availability = "in-stock" | "limited" | "made-to-order"

export interface Category {
  id: string
  slug: string
  name: string
  description: string
  icon: string
}

export interface Supplier {
  id: string
  name: string
  city: string
  country: string
  verified: boolean
  rating: number
  yearsInBusiness: number
  responseTime: string
  certifications: string[]
}

export interface Product {
  id: string
  slug: string
  name: string
  category: Category
  fabricType: string
  color: string
  colorHex: string
  composition: string
  weightGsm: number
  widthCm: number
  pricePerUnit: number
  currency: "USD"
  unit: "meter" | "yard" | "kg"
  moq: number
  availability: Availability
  leadTimeDays: number
  supplier: Supplier
  rating: number
  reviewCount: number
  description: string
  tags: string[]
  images: string[]
  featured: boolean
  isActive: boolean
  createdAt: string
}

export interface ProductFilters {
  search: string
  categoryIds: string[]
  colors: string[]
  priceMin: number | null
  priceMax: number | null
  moqMax: number | null
  availability: Availability[]
}

export type SortOption = "relevance" | "price-asc" | "price-desc" | "newest" | "rating"

export interface FilterOptions {
  colors: Array<{ name: string; hex: string }>
  priceBounds: { min: number; max: number }
  moqBounds: { min: number; max: number }
}
