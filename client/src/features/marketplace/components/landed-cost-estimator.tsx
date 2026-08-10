import { useMemo, useState } from "react"
import { Calculator } from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Product } from "@/features/marketplace/types"
import { countryCodes } from "@/lib/country-codes"
import { formatPrice } from "@/lib/format"
import { estimateLandedCost } from "@/lib/landed-cost"

export function LandedCostEstimator({
  product,
  quantity,
}: {
  product: Product
  quantity: number
}) {
  const [buyerCountry, setBuyerCountry] = useState(product.supplier.country)

  const result = useMemo(
    () =>
      estimateLandedCost({
        pricePerUnit: product.pricePerUnit,
        unit: product.unit,
        weightGsm: product.weightGsm,
        widthCm: product.widthCm,
        quantity,
        supplierCountry: product.supplier.country,
        buyerCountry,
      }),
    [product, quantity, buyerCountry],
  )

  return (
    <Accordion type="single" collapsible className="border-border rounded-lg border px-3">
      <AccordionItem value="landed-cost" className="border-b-0">
        <AccordionTrigger className="py-3 text-sm">
          <span className="flex items-center gap-2">
            <Calculator className="text-muted-foreground size-3.5" />
            Estimate landed cost
          </span>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-3 pb-4">
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="landed-cost-country" className="text-muted-foreground text-xs">
              Shipping to
            </label>
            <Select value={buyerCountry} onValueChange={setBuyerCountry}>
              <SelectTrigger id="landed-cost-country" className="h-8 w-[180px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {countryCodes.map((c) => (
                  <SelectItem key={c.iso2} value={c.country}>
                    {c.country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5 text-sm">
            <Row label={`Goods (${quantity} ${product.unit}s)`} value={formatPrice(result.goodsCost)} />
            <Row
              label={result.sameCountry ? "Domestic freight (est.)" : "Freight (est.)"}
              value={formatPrice(result.freightCost)}
            />
            <Row
              label={result.sameCountry ? "Duty" : `Import duty (est. ${result.dutyPercent}%)`}
              value={formatPrice(result.dutyCost)}
            />
            <div className="border-border mt-1 flex items-center justify-between border-t pt-1.5 font-semibold">
              <span className="text-foreground">Estimated landed cost</span>
              <span className="text-foreground">{formatPrice(result.totalLandedCost)}</span>
            </div>
            <div className="text-muted-foreground flex items-center justify-between text-xs">
              <span>Per {product.unit}</span>
              <span>{formatPrice(result.landedCostPerUnit)}</span>
            </div>
          </div>

          <p className="text-muted-foreground text-[11px] leading-relaxed">
            A planning estimate only — actual freight and duty depend on carrier, incoterm, and
            customs classification. Not a quote.
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  )
}
