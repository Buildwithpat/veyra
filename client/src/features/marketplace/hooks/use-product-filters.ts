import { useMemo } from "react"
import { useSearchParams } from "react-router-dom"

import type {
  Availability,
  ProductFilters,
  SortOption,
} from "@/features/marketplace/types"

function parseNumber(value: string | null): number | null {
  if (!value) return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

export function useProductFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters: ProductFilters = useMemo(
    () => ({
      search: searchParams.get("q") ?? "",
      categoryIds: searchParams.getAll("category"),
      colors: searchParams.getAll("color"),
      priceMin: parseNumber(searchParams.get("priceMin")),
      priceMax: parseNumber(searchParams.get("priceMax")),
      moqMax: parseNumber(searchParams.get("moqMax")),
      availability: searchParams.getAll("availability") as Availability[],
    }),
    [searchParams],
  )

  const sort = (searchParams.get("sort") as SortOption | null) ?? "relevance"

  const activeFilterCount =
    filters.categoryIds.length +
    filters.colors.length +
    filters.availability.length +
    (filters.priceMin != null || filters.priceMax != null ? 1 : 0) +
    (filters.moqMax != null ? 1 : 0)

  function updateParams(mutate: (params: URLSearchParams) => void) {
    const next = new URLSearchParams(searchParams)
    mutate(next)
    setSearchParams(next, { replace: true })
  }

  function setSearch(value: string) {
    updateParams((params) => {
      if (value) params.set("q", value)
      else params.delete("q")
    })
  }

  function toggleListValue(key: "category" | "color" | "availability", value: string) {
    updateParams((params) => {
      const current = params.getAll(key)
      params.delete(key)
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      next.forEach((v) => params.append(key, v))
    })
  }

  function setRange(key: "priceMin" | "priceMax" | "moqMax", value: number | null) {
    updateParams((params) => {
      if (value == null) params.delete(key)
      else params.set(key, String(value))
    })
  }

  function setSort(value: SortOption) {
    updateParams((params) => {
      if (value === "relevance") params.delete("sort")
      else params.set("sort", value)
    })
  }

  function clearFilters() {
    updateParams((params) => {
      const query = params.get("q")
      Array.from(params.keys()).forEach((key) => params.delete(key))
      if (query) params.set("q", query)
    })
  }

  return {
    filters,
    sort,
    activeFilterCount,
    setSearch,
    toggleListValue,
    setRange,
    setSort,
    clearFilters,
  }
}
