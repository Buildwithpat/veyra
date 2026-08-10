import { AlertTriangle, Heart } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { EmptyState } from "@/components/shared/empty-state"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductCard } from "@/features/marketplace/components/product-card"
import { useWishlist } from "@/features/wishlist/hooks/use-wishlist"
import { useDocumentTitle } from "@/hooks/use-document-title"

function WishlistGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="aspect-4/5 w-full rounded-xl" />
      ))}
    </div>
  )
}

export function DashboardWishlistPage() {
  useDocumentTitle("Wishlist")
  const navigate = useNavigate()
  const { data: wishlist, isPending, isError, refetch } = useWishlist()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Wishlist</h1>
        <p className="text-muted-foreground text-sm">
          Fabrics you've saved for later.
        </p>
      </div>

      {isPending ? (
        <WishlistGridSkeleton />
      ) : isError ? (
        <EmptyState
          icon={AlertTriangle}
          title="Couldn't load your wishlist"
          description="Something went wrong reaching the server."
          actionLabel="Retry"
          onAction={() => refetch()}
        />
      ) : !wishlist || wishlist.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Fabrics you save will show up here."
          actionLabel="Browse marketplace"
          onAction={() => navigate("/marketplace")}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
