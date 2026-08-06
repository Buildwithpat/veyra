import { useMemo } from "react"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"

import { fallbackProducts } from "@/components/landing/fallback-products"
import { FadeIn } from "@/components/shared/fade-in"
import { FabricMaterialCard } from "@/components/shared/fabric-material-card"
import { VeyraAiIcon } from "@/components/shared/veyra-ai-icon"
import { Button } from "@/components/ui/button"
import { useAssistantPanel } from "@/features/assistant/hooks/use-assistant-panel"
import { useFeaturedProducts } from "@/features/marketplace/hooks/use-featured-products"

const swatchLayout = [
  { className: "left-0 top-2 h-[70%] w-[58%]", rotate: -6 },
  { className: "right-0 top-0 h-[54%] w-[48%]", rotate: 5 },
  { className: "right-6 bottom-0 h-[48%] w-[46%]", rotate: -3 },
]

export function CtaSection() {
  const { openAssistant } = useAssistantPanel()
  const { data } = useFeaturedProducts()

  const swatchProducts = useMemo(() => {
    const real = data?.items ?? []
    if (real.length >= swatchLayout.length) return real.slice(0, swatchLayout.length)
    return fallbackProducts.slice(0, swatchLayout.length)
  }, [data])

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <FadeIn>
        <div className="border-border bg-surface relative overflow-hidden rounded-3xl border">
          <div
            className="bg-mesh-1 pointer-events-none absolute top-0 -left-20 -z-10 size-[440px] -translate-y-1/3 rounded-full blur-3xl"
            aria-hidden
          />
          <div
            className="bg-mesh-2 pointer-events-none absolute right-0 bottom-0 -z-10 size-[360px] translate-x-1/4 translate-y-1/4 rounded-full blur-3xl"
            aria-hidden
          />
          <div
            className="text-foreground pointer-events-none absolute inset-0 -z-10 opacity-[0.03]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, currentColor 0px, currentColor 1px, transparent 1px, transparent 7px)",
            }}
            aria-hidden
          />

          <div className="grid grid-cols-1 items-center gap-10 px-8 py-16 sm:px-12 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-6 lg:py-20">
            <div className="flex flex-col items-start text-left">
              <span className="border-border bg-card text-muted-foreground mb-5 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium">
                <VeyraAiIcon className="text-primary size-3.5" />
                AI-assisted sourcing, ready when you are
              </span>

              <h2 className="font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                Ready to source smarter?
              </h2>
              <p className="text-muted-foreground mt-4 max-w-md text-balance">
                Explore real fabric listings, or ask Veyra AI to find the right material for your
                next production run.
              </p>

              <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row">
                <Button asChild size="lg" className="shadow-primary/25 shadow-lg">
                  <Link to="/marketplace">
                    Explore marketplace
                    <ArrowRight />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="gap-2" onClick={() => openAssistant()}>
                  <VeyraAiIcon className="size-4" />
                  Talk to Veyra AI
                </Button>
              </div>
            </div>

            <div className="relative hidden h-56 sm:block lg:h-64">
              {swatchProducts.map((product, index) => {
                const layout = swatchLayout[index]
                return (
                  <FabricMaterialCard
                    key={product.id}
                    product={product}
                    className={`absolute ${layout.className}`}
                    rotate={layout.rotate}
                    floatDuration={5 + index * 0.6}
                    floatDelay={index * 0.25}
                    style={{ zIndex: index }}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  )
}
