import { AnimatePresence, motion } from "framer-motion"
import { GitCompare, X } from "lucide-react"

import { WeaveTexture, inferWeaveKind } from "@/components/shared/weave-texture"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Product } from "@/features/marketplace/types"
import { countryFlag } from "@/lib/country-flags"
import { formatNumber, formatPrice } from "@/lib/format"
import { computeMatchScore } from "@/lib/match-score"

interface CompareTrayProps {
  products: Product[]
  onRemove: (id: string) => void
  onClear: () => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

const rows: Array<[string, (p: Product) => string]> = [
  ["Price", (p) => `${formatPrice(p.pricePerUnit, p.currency)}/${p.unit}`],
  ["MOQ", (p) => `${formatNumber(p.moq)} ${p.unit}s`],
  ["Weight", (p) => `${p.weightGsm} gsm`],
  ["Width", (p) => `${p.widthCm} cm`],
  ["Weave", (p) => p.fabricType],
  ["Composition", (p) => p.composition],
  ["Availability", (p) => p.availability.replace("-", " ")],
  ["Lead time", (p) => `${p.leadTimeDays} days`],
  ["Supplier", (p) => p.supplier.name],
  ["Region", (p) => `${countryFlag(p.supplier.country)} ${p.supplier.country}`],
  ["AI match", (p) => `${computeMatchScore(p)}%`],
]

export function CompareTray({ products, onRemove, onClear, open, onOpenChange }: CompareTrayProps) {
  return (
    <>
      <AnimatePresence>
        {products.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="border-border bg-card/95 fixed inset-x-4 bottom-4 z-40 flex flex-wrap items-center gap-3 rounded-2xl border p-3 shadow-xl backdrop-blur-md sm:inset-x-auto sm:right-6 sm:left-6 sm:mx-auto sm:max-w-2xl"
          >
            <div className="flex flex-1 items-center gap-2 overflow-x-auto">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="border-border relative size-11 shrink-0 overflow-hidden rounded-lg border"
                >
                  <WeaveTexture
                    kind={inferWeaveKind(product.fabricType, product.tags)}
                    colorHex={product.colorHex}
                    seed={product.id}
                  />
                  <button
                    type="button"
                    onClick={() => onRemove(product.id)}
                    aria-label={`Remove ${product.name} from comparison`}
                    className="absolute top-0.5 right-0.5 flex size-4 items-center justify-center rounded-full bg-black/60 text-white"
                  >
                    <X className="size-2.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Button variant="ghost" size="sm" onClick={onClear}>
                Clear
              </Button>
              <Button
                size="sm"
                className="gap-1.5"
                disabled={products.length < 2}
                onClick={() => onOpenChange(true)}
              >
                <GitCompare className="size-3.5" />
                Compare ({products.length})
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Comparing {products.length} fabrics</DialogTitle>
          </DialogHeader>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="w-28" />
                  {products.map((product) => (
                    <th key={product.id} className="px-3 pb-3 text-left align-bottom">
                      <div className="border-border relative mb-2 size-14 overflow-hidden rounded-lg border">
                        <WeaveTexture
                          kind={inferWeaveKind(product.fabricType, product.tags)}
                          colorHex={product.colorHex}
                          seed={product.id}
                        />
                      </div>
                      <p className="text-foreground font-semibold">{product.name}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(([label, getValue]) => (
                  <tr key={label} className="border-border/60 border-t">
                    <td className="text-muted-foreground py-2.5 pr-3 text-xs font-medium">
                      {label}
                    </td>
                    {products.map((product) => (
                      <td key={product.id} className="text-foreground px-3 py-2.5 text-sm">
                        {getValue(product)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
