import { useMemo } from "react"

import { fallbackProducts } from "@/components/landing/fallback-products"
import { FabricLibraryTile } from "@/components/landing/fabric-library-tile"
import { FadeIn } from "@/components/shared/fade-in"
import { SectionHeading } from "@/components/shared/section-heading"
import { Skeleton } from "@/components/ui/skeleton"
import { useFeaturedProducts } from "@/features/marketplace/hooks/use-featured-products"

const TILE_COUNT = 12
// Varied aspect ratios give the CSS-columns layout a genuine masonry
// rhythm instead of uniform boxes.
const aspectRatios = ["aspect-[3/4]", "aspect-square", "aspect-[4/5]", "aspect-[3/5]"]

export function FabricLibrarySection() {
  const { data, isPending } = useFeaturedProducts()

  const { products, usingFallback } = useMemo(() => {
    const real = data?.items ?? []
    if (real.length >= TILE_COUNT) {
      return { products: real.slice(0, TILE_COUNT), usingFallback: false }
    }
    // Blend real listings with fallback samples so the wall is always full,
    // never repeating a real product to pad it out.
    return {
      products: [...real, ...fallbackProducts].slice(0, TILE_COUNT),
      usingFallback: true,
    }
  }, [data])

  return (
    <section className="bg-surface py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          align="left"
          eyebrow="Fabric library"
          title={usingFallback ? "A showroom wall of textile samples" : "A showroom wall of real textile samples"}
          description="Every tile is generated from the fabric's own weave, weight and color — hover for a quick spec, click to turn it over."
        />

        <div className="mt-12 columns-2 gap-4 sm:columns-3 lg:columns-4">
          {isPending
            ? Array.from({ length: TILE_COUNT }).map((_, i) => (
                <Skeleton
                  key={i}
                  className={`mb-4 w-full break-inside-avoid rounded-2xl ${aspectRatios[i % aspectRatios.length]}`}
                />
              ))
            : products.map((product, index) => (
                <FadeIn
                  key={product.id}
                  delay={Math.min(index * 0.03, 0.3)}
                  className="mb-4 break-inside-avoid"
                >
                  <FabricLibraryTile
                    product={product}
                    aspectClassName={aspectRatios[index % aspectRatios.length]}
                  />
                </FadeIn>
              ))}
        </div>
      </div>
    </section>
  )
}
