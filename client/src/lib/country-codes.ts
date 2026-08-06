/** Real ISO calling codes for the phone country-code picker — not exhaustive, but covers Veyra's seeded supplier countries plus other common markets. */
export interface CountryCode {
  code: string
  iso2: string
  country: string
}

export const countryCodes: CountryCode[] = [
  { code: "+1", iso2: "US", country: "United States" },
  { code: "+1", iso2: "CA", country: "Canada" },
  { code: "+44", iso2: "GB", country: "United Kingdom" },
  { code: "+91", iso2: "IN", country: "India" },
  { code: "+86", iso2: "CN", country: "China" },
  { code: "+880", iso2: "BD", country: "Bangladesh" },
  { code: "+92", iso2: "PK", country: "Pakistan" },
  { code: "+84", iso2: "VN", country: "Vietnam" },
  { code: "+90", iso2: "TR", country: "Turkey" },
  { code: "+39", iso2: "IT", country: "Italy" },
  { code: "+33", iso2: "FR", country: "France" },
  { code: "+49", iso2: "DE", country: "Germany" },
  { code: "+34", iso2: "ES", country: "Spain" },
  { code: "+351", iso2: "PT", country: "Portugal" },
  { code: "+31", iso2: "NL", country: "Netherlands" },
  { code: "+32", iso2: "BE", country: "Belgium" },
  { code: "+41", iso2: "CH", country: "Switzerland" },
  { code: "+46", iso2: "SE", country: "Sweden" },
  { code: "+82", iso2: "KR", country: "South Korea" },
  { code: "+81", iso2: "JP", country: "Japan" },
  { code: "+852", iso2: "HK", country: "Hong Kong" },
  { code: "+65", iso2: "SG", country: "Singapore" },
  { code: "+66", iso2: "TH", country: "Thailand" },
  { code: "+62", iso2: "ID", country: "Indonesia" },
  { code: "+60", iso2: "MY", country: "Malaysia" },
  { code: "+63", iso2: "PH", country: "Philippines" },
  { code: "+971", iso2: "AE", country: "United Arab Emirates" },
  { code: "+20", iso2: "EG", country: "Egypt" },
  { code: "+27", iso2: "ZA", country: "South Africa" },
  { code: "+234", iso2: "NG", country: "Nigeria" },
  { code: "+55", iso2: "BR", country: "Brazil" },
  { code: "+52", iso2: "MX", country: "Mexico" },
  { code: "+57", iso2: "CO", country: "Colombia" },
  { code: "+51", iso2: "PE", country: "Peru" },
  { code: "+61", iso2: "AU", country: "Australia" },
  { code: "+64", iso2: "NZ", country: "New Zealand" },
]
