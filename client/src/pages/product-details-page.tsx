import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ChevronRight, Star } from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
import { Skeleton } from "@/components/ui/skeleton"
import { AiInsightCard } from "@/features/marketplace/components/ai-insight-card"
import { BuyPanel } from "@/features/marketplace/components/buy-panel"
import { ImageGallery } from "@/features/marketplace/components/image-gallery"
import { MarketplaceProductCard } from "@/features/marketplace/components/marketplace-product-card"
import { ProductPreviewDialog } from "@/features/marketplace/components/product-preview-dialog"
import { SpecsTable } from "@/features/marketplace/components/specs-table"
import { SupplierCard } from "@/features/marketplace/components/supplier-card"
import { useProduct, useSimilarProducts } from "@/features/marketplace/hooks/use-product"
import type { Product } from "@/features/marketplace/types"
import { useDocumentTitle } from "@/hooks/use-document-title"

export function ProductDetailsPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { data: product, isPending } = useProduct(slug)
  const { data: similarProducts = [] } = useSimilarProducts(product)
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null)
  useDocumentTitle(product?.name ?? "Fabric Details")

  if (isPending) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <div className="flex flex-col gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="mt-4 h-40 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20">
        <EmptyState
          title="Fabric not found"
          description="This listing may have been removed or the link is incorrect."
          actionLabel="Back to marketplace"
          onAction={() => navigate("/marketplace")}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <nav className="text-muted-foreground mb-6 flex items-center gap-1.5 text-sm">
        <Link to="/marketplace" className="hover:text-foreground">
          Marketplace
        </Link>
        <ChevronRight className="size-3.5" />
        <span>{product.category.name}</span>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <ImageGallery
          productId={product.id}
          images={product.images}
          colorHex={product.colorHex}
          name={product.name}
        />

        <div className="flex flex-col gap-6">
          <div>
            <p className="text-muted-foreground text-sm">
              {product.fabricType} &middot; {product.color}
            </p>
            <h1 className="text-foreground mt-1 text-3xl font-semibold tracking-tight">
              {product.name}
            </h1>
            <div className="text-muted-foreground mt-2 flex items-center gap-1.5 text-sm">
              <Star className="fill-warning text-warning size-4" />
              <span className="text-foreground font-medium">
                {product.rating.toFixed(1)}
              </span>
              ({product.reviewCount} reviews)
            </div>
          </div>

          <p className="text-muted-foreground text-sm leading-relaxed">
            {product.description}
          </p>

          <BuyPanel product={product} />
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="flex flex-col gap-8 lg:col-span-2">
          <section>
            <h2 className="text-foreground mb-4 text-lg font-semibold">Specifications</h2>
            <SpecsTable product={product} />
          </section>

          <AiInsightCard product={product} />
        </div>

        <section>
          <h2 className="text-foreground mb-4 text-lg font-semibold">Supplier</h2>
          <SupplierCard supplier={product.supplier} />
        </section>
      </div>

      {similarProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-foreground mb-5 text-lg font-semibold">Similar fabrics</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {similarProducts.map((similar) => (
              <MarketplaceProductCard
                key={similar.id}
                product={similar}
                viewMode="large"
                compareChecked={false}
                onToggleCompare={() => {}}
                onPreview={() => setPreviewProduct(similar)}
              />
            ))}
          </div>
        </section>
      )}

      <ProductPreviewDialog
        product={previewProduct}
        onOpenChange={(open) => !open && setPreviewProduct(null)}
      />
    </div>
  )
}
