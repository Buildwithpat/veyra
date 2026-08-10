import { useMemo } from "react"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"

import { fallbackProducts } from "@/components/landing/fallback-products"
import { MarketplacePreviewCard } from "@/components/landing/marketplace-preview-card"
import { FadeIn } from "@/components/shared/fade-in"
import { SectionHeading } from "@/components/shared/section-heading"
import { Button } from "@/components/ui/button"
import { ProductCardSkeleton } from "@/features/marketplace/components/product-card-skeleton"
import { useFeaturedProducts } from "@/features/marketplace/hooks/use-featured-products"

export function MarketplacePreviewSection() {
  const { data, isPending } = useFeaturedProducts()

  const { products, usingFallback } = useMemo(() => {
    const real = (data?.items ?? []).filter((p) => p.featured)
    if (real.length >= 4) return { products: real.slice(0, 4), usingFallback: false }
    return {
      products: [...real, ...fallbackProducts].slice(0, 4),
      usingFallback: true,
    }
  }, [data])

  return (
    <section className="bg-accent/50 border-border/60 border-y py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="border-border/70 flex flex-col items-start gap-6 border-b pb-8 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            align="left"
            eyebrow="Marketplace preview"
            title="Real listings, live from the marketplace"
            description={
              usingFallback
                ? "Fabric, supplier and pricing — sample listings shown while the marketplace catalog fills in."
                : "Fabric, supplier and pricing — no screenshots, no placeholders."
            }
          />
          <Button asChild variant="outline" className="shrink-0 gap-2">
            <Link to="/marketplace">
              View all fabrics
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {isPending
            ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : products.map((product, index) => (
                <FadeIn key={product.id} delay={index * 0.06}>
                  <MarketplacePreviewCard product={product} />
                </FadeIn>
              ))}
        </div>
      </div>
    </section>
  )
}
