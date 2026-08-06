import { useState } from "react"
import { SlidersHorizontal } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { FiltersContent } from "@/features/marketplace/components/filters-content"
import type {
  Category,
  FilterOptions,
  ProductFilters,
} from "@/features/marketplace/types"

interface FiltersPanelProps {
  categories: Category[]
  filterOptions: FilterOptions
  filters: ProductFilters
  activeFilterCount: number
  onToggleList: (key: "category" | "color" | "availability", value: string) => void
  onSetRange: (key: "priceMin" | "priceMax" | "moqMax", value: number | null) => void
  onClear: () => void
}

/** Advanced filters live entirely in a slide-in panel — no permanent sidebar. */
export function FiltersPanel(props: FiltersPanelProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-background/80 shrink-0 gap-2 rounded-full backdrop-blur-sm"
        >
          <SlidersHorizontal className="size-3.5" />
          Filters
          {props.activeFilterCount > 0 && (
            <Badge className="ml-0.5 px-1.5">{props.activeFilterCount}</Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="px-6 pb-6">
          <FiltersContent {...props} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
