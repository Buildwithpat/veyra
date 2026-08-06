import type { Product } from "@/features/marketplace/types"
import { formatNumber } from "@/lib/format"

interface SpecsTableProps {
  product: Product
}

export function SpecsTable({ product }: SpecsTableProps) {
  const rows: Array<[string, string]> = [
    ["Composition", product.composition],
    ["Weight", `${product.weightGsm} gsm`],
    ["Width", `${product.widthCm} cm`],
    ["Fabric type", product.fabricType],
    ["Color", product.color],
    ["Unit of sale", product.unit],
    ["MOQ", `${formatNumber(product.moq)} ${product.unit}s`],
    ["Lead time", `${product.leadTimeDays} days`],
  ]

  return (
    <dl className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
      {rows.map(([label, value]) => (
        <div
          key={label}
          className="border-border/60 flex items-center justify-between border-b pb-3 sm:justify-start sm:gap-4"
        >
          <dt className="text-muted-foreground text-sm">{label}</dt>
          <dd className="text-foreground text-sm font-medium">{value}</dd>
        </div>
      ))}
    </dl>
  )
}
