const FLAGS: Record<string, string> = {
  india: "🇮🇳",
  italy: "🇮🇹",
  turkey: "🇹🇷",
  portugal: "🇵🇹",
  australia: "🇦🇺",
  bangladesh: "🇧🇩",
  china: "🇨🇳",
  "united states": "🇺🇸",
  usa: "🇺🇸",
  vietnam: "🇻🇳",
  pakistan: "🇵🇰",
  spain: "🇪🇸",
  france: "🇫🇷",
  japan: "🇯🇵",
  "south korea": "🇰🇷",
  indonesia: "🇮🇩",
  peru: "🇵🇪",
  egypt: "🇪🇬",
  brazil: "🇧🇷",
}

export function countryFlag(country: string): string {
  return FLAGS[country.trim().toLowerCase()] ?? "🌐"
}
