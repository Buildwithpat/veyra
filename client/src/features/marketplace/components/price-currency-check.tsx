import { useState } from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { convertFromUsd, currencyOptions } from "@/lib/currency"
import { formatPrice } from "@/lib/format"

export function PriceCurrencyCheck({ amountUsd }: { amountUsd: number }) {
  const [currency, setCurrency] = useState<string | null>(null)

  return (
    <div className="flex items-center gap-2 text-xs">
      {currency && (
        <span className="text-muted-foreground">
          &asymp; {formatPrice(convertFromUsd(amountUsd, currency), currency)}
        </span>
      )}
      <Select value={currency ?? undefined} onValueChange={setCurrency}>
        <SelectTrigger className="text-muted-foreground h-7 w-auto gap-1 border-none px-0 shadow-none hover:text-foreground">
          <SelectValue placeholder="Check price in another currency" />
        </SelectTrigger>
        <SelectContent>
          {currencyOptions
            .filter((c) => c.code !== "USD")
            .map((c) => (
              <SelectItem key={c.code} value={c.code}>
                {c.code} &middot; {c.label}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  )
}
