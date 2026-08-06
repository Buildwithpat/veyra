import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

import { ProductVisual } from "@/components/shared/product-visual"
import { cn } from "@/lib/utils"

interface ImageGalleryProps {
  productId: string
  images: string[]
  colorHex: string
  name: string
}

const PLACEHOLDER_VARIANTS = 4

export function ImageGallery({ productId, images, colorHex, name }: ImageGalleryProps) {
  const [active, setActive] = useState(0)
  const count = images.length > 0 ? images.length : PLACEHOLDER_VARIANTS

  return (
    <div className="flex flex-col gap-3">
      <div className="border-border relative aspect-square overflow-hidden rounded-xl border">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
          >
            <ProductVisual
              images={images}
              index={active}
              colorHex={colorHex}
              seed={`${productId}-${active}`}
              alt={`${name} view ${active + 1}`}
              className="size-full"
              eager
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`${name} view ${index + 1}`}
            className={cn(
              "aspect-square overflow-hidden rounded-lg border-2 transition-colors",
              active === index ? "border-primary" : "border-transparent",
            )}
          >
            <ProductVisual
              images={images}
              index={index}
              colorHex={colorHex}
              seed={`${productId}-${index}`}
              alt={`${name} thumbnail ${index + 1}`}
              className="size-full"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
