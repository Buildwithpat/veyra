export function formatPrice(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value)
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value)
}
