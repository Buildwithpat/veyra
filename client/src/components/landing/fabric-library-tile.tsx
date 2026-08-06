import { useRef, useState } from "react"
import { motion } from "framer-motion"

import { inferWeaveKind, WeaveTexture } from "@/components/shared/weave-texture"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/features/marketplace/types"
import { computeMatchScore } from "@/lib/match-score"

interface FabricLibraryTileProps {
  product: Product
  aspectClassName: string
}

/**
 * A luxury sample-book tile — hover lifts and bends it slightly and reveals
 * a quick spec overlay; clicking flips the whole tile over to a properly
 * laid-out spec panel on the back, like turning a physical swatch card.
 */
export function FabricLibraryTile({ product, aspectClassName }: FabricLibraryTileProps) {
  const [flipped, setFlipped] = useState(false)
  const tileRef = useRef<HTMLButtonElement>(null)
  const weaveKind = inferWeaveKind(product.fabricType, product.tags)
  const matchScore = computeMatchScore(product)

  function handleMouseMove(e: React.MouseEvent<HTMLButtonElement>) {
    const bounds = tileRef.current?.getBoundingClientRect()
    if (!bounds) return
    const px = ((e.clientX - bounds.left) / bounds.width) * 100
    const py = ((e.clientY - bounds.top) / bounds.height) * 100
    tileRef.current?.style.setProperty("--lx", `${px}%`)
    tileRef.current?.style.setProperty("--ly", `${py}%`)
  }

  return (
    <div className={`relative w-full ${aspectClassName}`} style={{ perspective: 1400 }}>
      <motion.div
        className="relative size-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 190, damping: 22 }}
      >
        {/* Front — texture face */}
        <motion.button
          ref={tileRef}
          type="button"
          onClick={() => setFlipped(true)}
          onMouseMove={handleMouseMove}
          aria-label={`View full specification for ${product.name}`}
          className="group border-border/70 absolute inset-0 overflow-hidden rounded-2xl border text-left shadow-[0_16px_36px_-16px_rgba(35,22,10,0.3)]"
          style={{ backfaceVisibility: "hidden", pointerEvents: flipped ? "none" : "auto" }}
          whileHover={{ y: -8, rotateX: -4, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <WeaveTexture kind={weaveKind} colorHex={product.colorHex} seed={product.id} />

          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(160px circle at var(--lx, 50%) var(--ly, 50%), rgba(255,255,255,0.35), transparent 60%)",
            }}
          />

          {/* White text over an arbitrary swatch color — a token color
              can't guarantee contrast here, so this is a deliberate exception. */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent p-3 pt-12">
            <p className="truncate text-sm font-semibold text-white">{product.name}</p>
            <p className="text-[11px] text-white/0 transition-colors duration-200 group-hover:text-white/80">
              {product.composition}
            </p>
            <div className="mt-1.5 grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10px] text-white/0 transition-colors delay-75 duration-200 group-hover:text-white/75">
              <span>{product.weightGsm} gsm</span>
              <span>{product.widthCm} cm wide</span>
              <span>
                MOQ {product.moq} {product.unit}s
              </span>
              <span>{product.supplier.country}</span>
            </div>
            <div className="mt-1.5 flex items-center gap-1 text-[10px] text-white/0 transition-colors delay-100 duration-200 group-hover:text-white/90">
              <span className="bg-primary/80 rounded-full px-1.5 py-0.5 font-medium text-white">
                {matchScore}% AI match
              </span>
            </div>
          </div>
        </motion.button>

        {/* Back — full spec panel */}
        <div
          className="border-border bg-card absolute inset-0 flex flex-col justify-between overflow-hidden rounded-2xl border p-4 shadow-[0_16px_36px_-16px_rgba(35,22,10,0.2)]"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            pointerEvents: flipped ? "auto" : "none",
          }}
        >
          <div>
            <div className="flex items-start justify-between gap-2">
              <p className="font-display text-foreground text-sm leading-tight font-semibold">
                {product.name}
              </p>
              <button
                type="button"
                onClick={() => setFlipped(false)}
                className="text-muted-foreground hover:text-foreground text-xs"
                aria-label="Close specification"
              >
                ✕
              </button>
            </div>
            <p className="text-muted-foreground mt-1 text-[11px] leading-relaxed">
              {product.composition}
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10px]">
            <div>
              <dt className="text-muted-foreground">Weave</dt>
              <dd className="text-foreground font-medium">{product.fabricType}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">GSM</dt>
              <dd className="text-foreground font-medium">{product.weightGsm}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Width</dt>
              <dd className="text-foreground font-medium">{product.widthCm} cm</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">MOQ</dt>
              <dd className="text-foreground font-medium">
                {product.moq} {product.unit}s
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Region</dt>
              <dd className="text-foreground font-medium">{product.supplier.country}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">AI match</dt>
              <dd className="text-primary font-semibold">{matchScore}%</dd>
            </div>
          </dl>

          <div className="flex flex-wrap items-center gap-1">
            <Badge variant="outline" className="text-[9px]">
              {product.availability.replace("-", " ")}
            </Badge>
            {product.supplier.certifications.slice(0, 2).map((cert) => (
              <Badge key={cert} variant="outline" className="text-[9px]">
                {cert}
              </Badge>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
