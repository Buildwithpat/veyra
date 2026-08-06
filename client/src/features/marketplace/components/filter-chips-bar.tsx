import { categoryIcons, defaultCategoryIcon } from "@/features/marketplace/category-icons"
import { FiltersPanel } from "@/features/marketplace/components/filters-panel"
import type {
  Availability,
  Category,
  FilterOptions,
  ProductFilters,
} from "@/features/marketplace/types"
import { cn } from "@/lib/utils"

const quickAvailability: Array<{ value: Availability; label: string }> = [
  { value: "in-stock", label: "In stock" },
  { value: "limited", label: "Limited" },
  { value: "made-to-order", label: "Made to order" },
]

interface FilterChipsBarProps {
  categories: Category[]
  filterOptions: FilterOptions
  filters: ProductFilters
  activeFilterCount: number
  onToggleList: (key: "category" | "color" | "availability", value: string) => void
  onSetRange: (key: "priceMin" | "priceMax" | "moqMax", value: number | null) => void
  onClear: () => void
}

/** Two separate floating glass cards replace the permanent sidebar — materials and stock status are distinct facets, so they get distinct chip groups. Advanced filters still slide in. */
export function FilterChipsBar(props: FilterChipsBarProps) {
  const { categories, filters, activeFilterCount, onToggleList, onClear } = props

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <div className="border-border/60 bg-card/70 flex flex-1 items-center gap-2 overflow-x-auto rounded-2xl border p-2.5 shadow-sm backdrop-blur-md [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((category) => {
          const Icon = categoryIcons[category.icon] ?? defaultCategoryIcon
          const active = filters.categoryIds.includes(category.id)
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onToggleList("category", category.id)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border/70 bg-background/60 text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <Icon className="size-3.5" />
              {category.name}
            </button>
          )
        })}
      </div>

      <div className="border-border/60 bg-card/70 flex shrink-0 items-center gap-2 rounded-2xl border p-2.5 shadow-sm backdrop-blur-md">
        {quickAvailability.map((option) => {
          const active = filters.availability.includes(option.value)
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onToggleList("availability", option.value)}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border/70 bg-background/60 text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              {option.label}
            </button>
          )
        })}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="text-muted-foreground hover:text-foreground px-1.5 text-xs font-medium transition-colors"
          >
            Clear
          </button>
        )}
        <FiltersPanel {...props} />
      </div>
    </div>
  )
}
