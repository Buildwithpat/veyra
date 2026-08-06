import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import type {
  Availability,
  Category,
  FilterOptions,
  ProductFilters,
} from "@/features/marketplace/types"
import { cn } from "@/lib/utils"
import { formatPrice } from "@/lib/format"

const availabilityOptions: Array<{ value: Availability; label: string }> = [
  { value: "in-stock", label: "In stock" },
  { value: "limited", label: "Limited stock" },
  { value: "made-to-order", label: "Made to order" },
]

interface FiltersContentProps {
  categories: Category[]
  filterOptions: FilterOptions
  filters: ProductFilters
  activeFilterCount: number
  onToggleList: (key: "category" | "color" | "availability", value: string) => void
  onSetRange: (key: "priceMin" | "priceMax" | "moqMax", value: number | null) => void
  onClear: () => void
}

export function FiltersContent({
  categories,
  filterOptions,
  filters,
  activeFilterCount,
  onToggleList,
  onSetRange,
  onClear,
}: FiltersContentProps) {
  const { colors, priceBounds, moqBounds } = filterOptions

  const priceRange = [
    filters.priceMin ?? priceBounds.min,
    filters.priceMax ?? priceBounds.max,
  ]
  const moqValue = filters.moqMax ?? moqBounds.max

  return (
    <div className="flex flex-col gap-6">
      {activeFilterCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-fit px-2 text-xs"
          onClick={onClear}
        >
          Clear all filters
        </Button>
      )}

      <div className="flex flex-col gap-3">
        <p className="text-muted-foreground text-xs font-medium uppercase">Category</p>
        <div className="flex flex-col gap-2.5">
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex cursor-pointer items-center gap-2.5 text-sm"
            >
              <Checkbox
                checked={filters.categoryIds.includes(category.id)}
                onCheckedChange={() => onToggleList("category", category.id)}
              />
              {category.name}
            </label>
          ))}
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-3">
        <p className="text-muted-foreground text-xs font-medium uppercase">Color</p>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => {
            const active = filters.colors.includes(color.name)
            return (
              <button
                key={color.name}
                type="button"
                title={color.name}
                onClick={() => onToggleList("color", color.name)}
                className={cn(
                  "size-7 rounded-full border-2 transition-all",
                  active ? "border-primary" : "ring-border border-transparent ring-1",
                )}
                style={{ backgroundColor: color.hex }}
              >
                <span className="sr-only">{color.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-xs font-medium uppercase">Price</p>
          <p className="text-muted-foreground text-xs">
            {formatPrice(priceRange[0])} &ndash; {formatPrice(priceRange[1])}
          </p>
        </div>
        <Slider
          min={priceBounds.min}
          max={priceBounds.max}
          step={1}
          value={priceRange}
          onValueChange={([min, max]) => {
            onSetRange("priceMin", min === priceBounds.min ? null : min)
            onSetRange("priceMax", max === priceBounds.max ? null : max)
          }}
        />
      </div>

      <Separator />

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-xs font-medium uppercase">Max MOQ</p>
          <p className="text-muted-foreground text-xs">{moqValue} units</p>
        </div>
        <Slider
          min={moqBounds.min}
          max={moqBounds.max}
          step={10}
          value={[moqValue]}
          onValueChange={([value]) =>
            onSetRange("moqMax", value === moqBounds.max ? null : value)
          }
        />
      </div>

      <Separator />

      <div className="flex flex-col gap-3">
        <p className="text-muted-foreground text-xs font-medium uppercase">
          Availability
        </p>
        <div className="flex flex-col gap-2.5">
          {availabilityOptions.map((option) => (
            <Label
              key={option.value}
              className="flex cursor-pointer items-center gap-2.5"
            >
              <Checkbox
                checked={filters.availability.includes(option.value)}
                onCheckedChange={() => onToggleList("availability", option.value)}
              />
              {option.label}
            </Label>
          ))}
        </div>
      </div>
    </div>
  )
}
