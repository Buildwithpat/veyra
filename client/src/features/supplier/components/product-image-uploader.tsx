import { useRef } from "react"
import { ImagePlus, X } from "lucide-react"
import { toast } from "sonner"

import {
  useRemoveProductImage,
  useUploadProductImage,
} from "@/features/supplier/hooks/use-product-images"

const MAX_FILE_SIZE = 5 * 1024 * 1024

export function ProductImageUploader({
  productId,
  images,
}: {
  productId: string
  images: string[]
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadImage = useUploadProductImage()
  const removeImage = useRemoveProductImage()

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image must be smaller than 5MB")
      return
    }

    uploadImage.mutate(
      { id: productId, file },
      {
        onSuccess: () => toast.success("Image uploaded"),
        onError: () => toast.error("Could not upload image. Try again."),
      },
    )
  }

  function handleRemove(url: string) {
    removeImage.mutate(
      { id: productId, url },
      {
        onError: () => toast.error("Could not remove image. Try again."),
      },
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {images.map((url) => (
          <div
            key={url}
            className="group border-border relative aspect-square overflow-hidden rounded-lg border"
          >
            <img
              src={url}
              alt="Uploaded product photo"
              loading="lazy"
              className="size-full object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemove(url)}
              className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X className="size-3.5" />
              <span className="sr-only">Remove image</span>
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadImage.isPending}
          className="border-border text-muted-foreground hover:border-primary/40 hover:text-foreground flex aspect-square flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed transition-colors disabled:opacity-50"
        >
          <ImagePlus className="size-5" />
          <span className="text-xs">
            {uploadImage.isPending ? "Uploading..." : "Add image"}
          </span>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <p className="text-muted-foreground text-xs">
        JPG or PNG, up to 5MB. The first image is used as the primary listing photo.
      </p>
    </div>
  )
}
