import { cn } from "@/lib/utils"

function hashSeed(seed: string) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

interface FabricSwatchProps {
  colorHex: string
  seed: string
  className?: string
}

/**
 * Generates a fabric-swatch-style placeholder from a color and seed —
 * stands in for product photography until real supplier images exist.
 */
export function FabricSwatch({ colorHex, seed, className }: FabricSwatchProps) {
  const hash = hashSeed(seed)
  const angle = hash % 180
  const weaveOpacity = 0.04 + ((hash >> 3) % 5) * 0.008
  const sheenOpacity = 0.1 + ((hash >> 6) % 4) * 0.03

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ backgroundColor: colorHex }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(${angle}deg, rgba(255,255,255,${sheenOpacity}), transparent 55%)`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `repeating-linear-gradient(${angle + 90}deg, rgba(0,0,0,${weaveOpacity}) 0px, rgba(0,0,0,${weaveOpacity}) 1px, transparent 1px, transparent 4px)`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/5" />
    </div>
  )
}
