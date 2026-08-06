import { FabricSwatch } from "@/components/shared/fabric-swatch"
import { cn } from "@/lib/utils"

interface ProductVisualProps {
  images: string[]
  index?: number
  colorHex: string
  seed: string
  alt: string
  className?: string
  /** Skip lazy-loading for above-the-fold images (e.g. the PDP hero photo). */
  eager?: boolean
}

/**
 * Renders a real product photo when the supplier has uploaded one (via
 * Cloudinary), falling back to the generated FabricSwatch placeholder.
 */
export function ProductVisual({
  images,
  index = 0,
  colorHex,
  seed,
  alt,
  className,
  eager = false,
}: ProductVisualProps) {
  const src = images[index]

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className={cn("object-cover", className)}
      />
    )
  }

  return <FabricSwatch colorHex={colorHex} seed={seed} className={className} />
}
