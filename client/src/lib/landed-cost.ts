import { countryCodes } from "@/lib/country-codes"

/**
 * A planning-grade estimate, not a customs quote. Freight and duty depend on
 * carrier, incoterm, trade agreements, and exact HS classification — none of
 * which this app has data for. This exists to give buyers a directionally
 * useful landed-cost figure early in sourcing, not a number to check out
 * against. Every UI surface using this must say so.
 */

type Region = "north-america" | "europe" | "east-asia" | "south-asia" | "other"

const REGION_BY_ISO2: Record<string, Region> = {
  US: "north-america",
  CA: "north-america",
  MX: "north-america",
  GB: "europe",
  FR: "europe",
  DE: "europe",
  ES: "europe",
  PT: "europe",
  NL: "europe",
  BE: "europe",
  CH: "europe",
  SE: "europe",
  IT: "europe",
  TR: "europe",
  CN: "east-asia",
  KR: "east-asia",
  JP: "east-asia",
  HK: "east-asia",
  SG: "east-asia",
  VN: "east-asia",
  IN: "south-asia",
  BD: "south-asia",
  PK: "south-asia",
}

function regionForCountryName(countryName: string): Region {
  const entry = countryCodes.find(
    (c) => c.country.toLowerCase() === countryName.trim().toLowerCase(),
  )
  return (entry && REGION_BY_ISO2[entry.iso2]) || "other"
}

// $ per kg by (origin region, destination region) — same-region freight is
// cheaper than intercontinental, and same-country is cheapest of all. These
// are illustrative planning figures, not carrier rate-card data.
const FREIGHT_USD_PER_KG: Record<Region, Partial<Record<Region, number>>> = {
  "north-america": { "north-america": 1.4, europe: 4.8, "east-asia": 5.6, "south-asia": 6.2, other: 6.5 },
  europe: { "north-america": 4.8, europe: 1.2, "east-asia": 5.2, "south-asia": 5.6, other: 6.0 },
  "east-asia": { "north-america": 5.6, europe: 5.2, "east-asia": 1.6, "south-asia": 2.4, other: 5.8 },
  "south-asia": { "north-america": 6.2, europe: 5.6, "east-asia": 2.4, "south-asia": 1.6, other: 5.8 },
  other: { "north-america": 6.5, europe: 6.0, "east-asia": 5.8, "south-asia": 5.8, other: 6.0 },
}

// Rough import-duty % by destination region for woven/knit textiles in
// general — real duty depends on exact HS code and any trade agreement
// between the two countries, which this estimate deliberately ignores.
const DUTY_PERCENT_BY_DESTINATION: Record<Region, number> = {
  "north-america": 9,
  europe: 8,
  "east-asia": 10,
  "south-asia": 12,
  other: 10,
}

export interface LandedCostInput {
  pricePerUnit: number
  unit: "meter" | "yard" | "kg"
  weightGsm: number
  widthCm: number
  quantity: number
  supplierCountry: string
  buyerCountry: string
}

export interface LandedCostResult {
  unitWeightKg: number
  totalWeightKg: number
  goodsCost: number
  freightCost: number
  dutyCost: number
  totalLandedCost: number
  landedCostPerUnit: number
  sameCountry: boolean
  dutyPercent: number
}

/** Converts a fabric's weight (gsm) and width (cm) into kg per linear unit. */
function unitWeightKg(weightGsm: number, widthCm: number, unit: LandedCostInput["unit"]): number {
  const gramsPerLinearMeter = weightGsm * (widthCm / 100)
  if (unit === "kg") return 1
  if (unit === "yard") return (gramsPerLinearMeter * 0.9144) / 1000
  return gramsPerLinearMeter / 1000
}

export function estimateLandedCost(input: LandedCostInput): LandedCostResult {
  const { pricePerUnit, unit, weightGsm, widthCm, quantity, supplierCountry, buyerCountry } = input

  const sameCountry = supplierCountry.trim().toLowerCase() === buyerCountry.trim().toLowerCase()
  const originRegion = regionForCountryName(supplierCountry)
  const destRegion = regionForCountryName(buyerCountry)

  const perUnitKg = unitWeightKg(weightGsm, widthCm, unit)
  const totalWeightKg = perUnitKg * quantity
  const goodsCost = pricePerUnit * quantity

  const freightRate = sameCountry
    ? 0.5
    : (FREIGHT_USD_PER_KG[originRegion]?.[destRegion] ?? FREIGHT_USD_PER_KG.other.other!)
  const freightCost = freightRate * totalWeightKg

  const dutyPercent = sameCountry ? 0 : DUTY_PERCENT_BY_DESTINATION[destRegion]
  const dutyCost = (goodsCost * dutyPercent) / 100

  const totalLandedCost = goodsCost + freightCost + dutyCost

  return {
    unitWeightKg: perUnitKg,
    totalWeightKg,
    goodsCost,
    freightCost,
    dutyCost,
    totalLandedCost,
    landedCostPerUnit: quantity > 0 ? totalLandedCost / quantity : 0,
    sameCountry,
    dutyPercent,
  }
}
