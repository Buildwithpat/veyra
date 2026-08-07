import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { AlertTriangle } from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
import { CompareTray } from "@/features/marketplace/components/compare-tray"
import { FilterChipsBar } from "@/features/marketplace/components/filter-chips-bar"
import { MarketplaceProductCard } from "@/features/marketplace/components/marketplace-product-card"
import { MarketplaceSearchBar } from "@/features/marketplace/components/marketplace-search-bar"
import { ProductCardSkeleton } from "@/features/marketplace/components/product-card-skeleton"
import { ProductPreviewDialog } from "@/features/marketplace/components/product-preview-dialog"
import { SortDropdown } from "@/features/marketplace/components/sort-dropdown"
import { ViewModeToggle } from "@/features/marketplace/components/view-mode-toggle"
import { useCategories } from "@/features/marketplace/hooks/use-categories"
import { useFilterOptions } from "@/features/marketplace/hooks/use-filter-options"
import { useInfiniteScrollTrigger } from "@/features/marketplace/hooks/use-infinite-scroll-trigger"
import { useProductFilters } from "@/features/marketplace/hooks/use-product-filters"
import { useProducts } from "@/features/marketplace/hooks/use-products"
import { useViewMode } from "@/features/marketplace/hooks/use-view-mode"
import type { Product } from "@/features/marketplace/types"
import { useDocumentTitle } from "@/hooks/use-document-title"

const MAX_COMPARE = 3

function dedupeById(products: Product[]): Product[] {
  const seen = new Set<string>()
  return products.filter((p) => {
    if (seen.has(p.id)) return false
    seen.add(p.id)
    return true
  })
}

const gridClass: Record<string, string> = {
  large: "grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3",
  compact: "grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5",
  masonry: "columns-1 gap-6 sm:columns-2 xl:columns-3 [&>*]:mb-6 [&>*]:break-inside-avoid",
}

export function MarketplacePage() {
  useDocumentTitle("Marketplace")
  const {
    filters,
    sort,
    activeFilterCount,
    setSearch,
    toggleListValue,
    setRange,
    setSort,
    clearFilters,
  } = useProductFilters()

  const { data: categories = [] } = useCategories()
  const filterOptions = useFilterOptions()
  const productsQuery = useProducts(filters, sort)
  const [viewMode, setViewMode] = useViewMode()
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [compareOpen, setCompareOpen] = useState(false)
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null)

  // Pages are deduped by id defensively — a product tied with its neighbor
  // on the sort key can otherwise be returned by both the page-N and
  // page-N+1 queries and appear twice once the infinite-scroll pages are
  // flattened, which would double it up in the grid and in compare.
  const items = dedupeById(productsQuery.data?.pages.flatMap((page) => page.items) ?? [])
  const total = productsQuery.data?.pages[0]?.total ?? 0
  const hasNextPage = productsQuery.hasNextPage ?? false
  const compareProducts = items.filter((p) => compareIds.includes(p.id))

  const loadMoreRef = useInfiniteScrollTrigger(() => {
    if (hasNextPage && !productsQuery.isFetchingNextPage) {
      productsQuery.fetchNextPage()
    }
  }, hasNextPage)

  function toggleCompare(id: string) {
    setCompareIds((current) => {
      if (current.includes(id)) return current.filter((v) => v !== id)
      if (current.length >= MAX_COMPARE) return current
      return [...current, id]
    })
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 pb-28">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Marketplace</h1>
        <p className="text-muted-foreground mt-1">
          Browse verified fabric suppliers across {categories.length} categories, matched by AI.
        </p>
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <MarketplaceSearchBar
          value={filters.search}
          onSearch={setSearch}
          onDetectPriceMax={(value) => setRange("priceMax", value)}
        />
        <div className="flex shrink-0 items-center gap-2">
          <ViewModeToggle value={viewMode} onChange={setViewMode} />
          <SortDropdown value={sort} onChange={setSort} />
        </div>
      </div>

      <div className="mb-6">
        <FilterChipsBar
          categories={categories}
          filterOptions={filterOptions}
          filters={filters}
          activeFilterCount={activeFilterCount}
          onToggleList={toggleListValue}
          onSetRange={setRange}
          onClear={clearFilters}
        />
      </div>

      <p className="text-muted-foreground mb-4 text-sm">
        {productsQuery.isPending ? "Loading fabrics..." : `${total} fabrics found`}
      </p>

      {productsQuery.isPending ? (
        <div className={gridClass[viewMode]}>
          {Array.from({ length: viewMode === "compact" ? 10 : 6 }).map((_, i) => (
            <ProductCardSkeleton key={i} compact={viewMode === "compact"} />
          ))}
        </div>
      ) : productsQuery.isError ? (
        <EmptyState
          icon={AlertTriangle}
          title="Couldn't load the marketplace"
          description="Something went wrong reaching the server. Check your connection and try again."
          actionLabel="Retry"
          onAction={() => productsQuery.refetch()}
        />
      ) : items.length === 0 ? (
        <EmptyState
          title="No fabrics match your search"
          description="Try widening your price range or clearing filters and search to see more results."
          actionLabel="Clear search & filters"
          onAction={() => {
            setSearch("")
            clearFilters()
          }}
        />
      ) : (
        <>
          <motion.div layout className={gridClass[viewMode]}>
            <AnimatePresence initial={false}>
              {items.map((product) => (
                <MarketplaceProductCard
                  key={product.id}
                  product={product}
                  viewMode={viewMode}
                  compareChecked={compareIds.includes(product.id)}
                  onToggleCompare={() => toggleCompare(product.id)}
                  onPreview={() => setPreviewProduct(product)}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {productsQuery.isFetchingNextPage && (
            <div className={`mt-6 ${gridClass[viewMode]}`}>
              {Array.from({ length: 3 }).map((_, i) => (
                <ProductCardSkeleton key={i} compact={viewMode === "compact"} />
              ))}
            </div>
          )}

          <div ref={loadMoreRef} className="h-1" />
        </>
      )}

      <CompareTray
        products={compareProducts}
        onRemove={(id) => setCompareIds((current) => current.filter((v) => v !== id))}
        onClear={() => setCompareIds([])}
        open={compareOpen}
        onOpenChange={setCompareOpen}
      />

      <ProductPreviewDialog
        product={previewProduct}
        onOpenChange={(open) => !open && setPreviewProduct(null)}
      />
    </div>
  )
}
