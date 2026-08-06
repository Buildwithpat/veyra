import { ArrowUpRight } from "lucide-react"

import { VeyraAiIcon } from "@/components/shared/veyra-ai-icon"
import { Card, CardContent } from "@/components/ui/card"
import { useAssistantPanel } from "@/features/assistant/hooks/use-assistant-panel"
import type { Product } from "@/features/marketplace/types"

function buildInsights(product: Product): string[] {
  const insights: string[] = []

  if (product.weightGsm < 120) {
    insights.push(
      `At ${product.weightGsm} gsm, this is a lightweight fabric well suited to shirting, linings and warm-weather garments.`,
    )
  } else if (product.weightGsm > 280) {
    insights.push(
      `At ${product.weightGsm} gsm, this is a heavyweight fabric best suited to outerwear, structured bags or upholstery-weight applications.`,
    )
  } else {
    insights.push(
      `At ${product.weightGsm} gsm, this sits in a versatile mid-weight range suited to both tops and structured garments.`,
    )
  }

  if (product.composition.toLowerCase().includes("elastane")) {
    insights.push(
      "Includes elastane for stretch recovery — a good fit for fitted or performance-driven silhouettes.",
    )
  }

  if (
    product.tags.some((t) =>
      [
        "organic",
        "recycled",
        "certified",
        "grs-certified",
        "biodegradable",
        "low-impact",
      ].includes(t),
    )
  ) {
    insights.push(
      "Carries sustainability credentials, making it a fit for brands with certified or low-impact sourcing requirements.",
    )
  }

  insights.push(
    `Priced ${product.pricePerUnit < 8 ? "competitively" : "at a premium"} for its category at an MOQ of ${product.moq} ${product.unit}s — ${product.moq <= 150 ? "accessible for smaller production runs." : "best suited to mid-to-large production runs."}`,
  )

  return insights.slice(0, 3)
}

export function AiInsightCard({ product }: { product: Product }) {
  const insights = buildInsights(product)
  const { openAssistant } = useAssistantPanel()

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="flex flex-col gap-3 pt-6">
        <div className="flex items-center gap-2">
          <VeyraAiIcon className="text-primary size-4" />
          <h3 className="text-foreground text-sm font-semibold">AI Fabric Insights</h3>
        </div>
        <ul className="flex flex-col gap-2">
          {insights.map((insight) => (
            <li key={insight} className="text-muted-foreground flex gap-2 text-sm">
              <span className="bg-primary mt-1.5 size-1 shrink-0 rounded-full" />
              {insight}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() =>
            openAssistant({
              prompt: `Explain why ${product.name} is suitable for my use case`,
              context: { productSlug: product.slug },
            })
          }
          className="text-primary hover:text-primary/80 mt-1 flex items-center gap-1 self-start text-sm font-medium transition-colors"
        >
          Ask a follow-up
          <ArrowUpRight className="size-3.5" />
        </button>
      </CardContent>
    </Card>
  )
}
