export interface CurrencyOption {
  code: string
  label: string
  rateFromUsd: number
}

// Static approximate rates against USD, for display-only conversion.
// The marketplace's actual prices, cart, and checkout always stay in USD.
export const currencyOptions: CurrencyOption[] = [
  { code: "USD", label: "US Dollar", rateFromUsd: 1 },
  { code: "EUR", label: "Euro", rateFromUsd: 0.92 },
  { code: "GBP", label: "British Pound", rateFromUsd: 0.79 },
  { code: "INR", label: "Indian Rupee", rateFromUsd: 83.1 },
  { code: "CNY", label: "Chinese Yuan", rateFromUsd: 7.24 },
  { code: "TRY", label: "Turkish Lira", rateFromUsd: 32.8 },
  { code: "BDT", label: "Bangladeshi Taka", rateFromUsd: 117.5 },
  { code: "AED", label: "UAE Dirham", rateFromUsd: 3.67 },
]

export function convertFromUsd(amountUsd: number, currencyCode: string): number {
  const option = currencyOptions.find((c) => c.code === currencyCode)
  if (!option) return amountUsd
  return amountUsd * option.rateFromUsd
}
