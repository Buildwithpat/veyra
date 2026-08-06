import { cn } from "@/lib/utils"

export type WeaveKind =
  | "plain"
  | "twill"
  | "herringbone"
  | "zigzag"
  | "ribbed-knit"
  | "denim"
  | "canvas"
  | "linen"
  | "satin"
  | "jacquard"
  | "waffle"
  | "corduroy"

const WEAVE_KEYWORDS: Array<[WeaveKind, string[]]> = [
  ["denim", ["denim", "selvedge"]],
  ["herringbone", ["herringbone"]],
  ["zigzag", ["zigzag", "chevron"]],
  ["corduroy", ["corduroy", "cord"]],
  ["waffle", ["waffle"]],
  ["jacquard", ["jacquard", "brocade", "damask"]],
  ["satin", ["satin", "silk", "charmeuse", "sateen"]],
  ["ribbed-knit", ["knit", "jersey", "rib", "terry"]],
  ["canvas", ["canvas", "duck"]],
  ["linen", ["linen"]],
  ["twill", ["twill", "flannel", "gabardine", "chino"]],
]

/** Infers a weave pattern from real product fields — never a fabricated label. */
export function inferWeaveKind(fabricType: string, tags: string[] = []): WeaveKind {
  const haystack = `${fabricType} ${tags.join(" ")}`.toLowerCase()
  for (const [kind, keywords] of WEAVE_KEYWORDS) {
    if (keywords.some((keyword) => haystack.includes(keyword))) return kind
  }
  return "plain"
}

function hashSeed(seed: string) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

const NOISE_BG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

function ridge(angle: number, pitch: number, weight: number) {
  return `repeating-linear-gradient(${angle}deg, rgba(0,0,0,${weight}) 0px, rgba(0,0,0,${weight}) 1px, transparent 1px, transparent ${pitch}px)`
}

function dotGrid(weight: number) {
  return `radial-gradient(rgba(0,0,0,${weight}) 1px, transparent 1.4px)`
}

/**
 * Renders one of twelve named weave patterns entirely with layered CSS
 * gradients — no images. `kind` should come from real product data via
 * `inferWeaveKind`, not be chosen arbitrarily.
 */
function weaveLayers(kind: WeaveKind, hash: number): { image: string; size?: string }[] {
  const pitch = 3 + (hash % 3)
  switch (kind) {
    case "twill":
      return [{ image: ridge(45, pitch + 1, 0.22) }]
    case "herringbone":
      return [
        { image: ridge(45, pitch, 0.2) },
        { image: ridge(-45, pitch, 0.14) },
      ]
    case "zigzag":
      return [
        { image: ridge(50, pitch, 0.2), size: "10px 10px" },
        { image: ridge(-50, pitch, 0.2), size: "10px 10px" },
      ]
    case "ribbed-knit":
      return [
        { image: ridge(90, pitch + 2, 0.24) },
        { image: dotGrid(0.06), size: "6px 6px" },
      ]
    case "denim":
      return [{ image: ridge(63, pitch + 2, 0.3) }]
    case "canvas":
      return [
        { image: ridge(0, pitch + 3, 0.14) },
        { image: ridge(90, pitch + 3, 0.14) },
      ]
    case "linen":
      return [
        { image: ridge(2, pitch + 4, 0.1) },
        { image: ridge(91, pitch + 5, 0.08) },
      ]
    case "satin":
      return [{ image: ridge(20, pitch + 6, 0.06) }]
    case "jacquard":
      return [{ image: dotGrid(0.14), size: "9px 9px" }]
    case "waffle":
      return [
        { image: ridge(0, pitch + 3, 0.2) },
        { image: ridge(90, pitch + 3, 0.2) },
      ]
    case "corduroy":
      return [{ image: ridge(90, pitch + 4, 0.26) }]
    case "plain":
    default:
      return [
        { image: ridge(0, pitch, 0.12) },
        { image: ridge(90, pitch, 0.12) },
      ]
  }
}

interface WeaveTextureProps {
  kind: WeaveKind
  colorHex: string
  seed: string
  className?: string
}

export function WeaveTexture({ kind, colorHex, seed, className }: WeaveTextureProps) {
  const hash = hashSeed(seed)
  const sheenAngle = (hash >> 4) % 180
  const layers = weaveLayers(kind, hash)
  const sheenOpacity = kind === "satin" ? 0.3 : 0.14

  return (
    <div
      className={cn("absolute inset-0", className)}
      style={{ backgroundColor: colorHex }}
    >
      {layers.map((layer, index) => (
        <div
          key={index}
          className="absolute inset-0 mix-blend-multiply"
          style={{ backgroundImage: layer.image, backgroundSize: layer.size }}
        />
      ))}
      {/* Fiber grain */}
      <div
        className="absolute inset-0 mix-blend-overlay"
        style={{ opacity: 0.45, backgroundImage: NOISE_BG }}
      />
      {/* Sheen — stronger for satin/silk, subtle elsewhere */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(${sheenAngle}deg, rgba(255,255,255,${sheenOpacity}), transparent 55%)`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/22 via-transparent to-white/8" />
    </div>
  )
}
