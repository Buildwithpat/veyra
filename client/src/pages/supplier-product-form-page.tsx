import { Link, useNavigate, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"

import { EmptyState } from "@/components/shared/empty-state"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductForm } from "@/features/supplier/components/product-form"
import { ProductImageUploader } from "@/features/supplier/components/product-image-uploader"
import { useCreateProduct } from "@/features/supplier/hooks/use-create-product"
import { useMyProduct } from "@/features/supplier/hooks/use-my-product"
import { useUpdateProduct } from "@/features/supplier/hooks/use-update-product"
import type { ProductFormValues } from "@/features/supplier/schemas"
import { useDocumentTitle } from "@/hooks/use-document-title"

export function SupplierProductFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  useDocumentTitle(isEdit ? "Edit Listing" : "New Listing")
  const navigate = useNavigate()
  const { data: product, isPending: isLoadingProduct } = useMyProduct(id)
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()

  if (isEdit && isLoadingProduct) {
    return (
      <div className="flex max-w-3xl flex-col gap-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    )
  }

  if (isEdit && !isLoadingProduct && !product) {
    return (
      <EmptyState
        title="Product not found"
        description="This listing may not exist or doesn't belong to your account."
      />
    )
  }

  const defaultValues: Partial<ProductFormValues> | undefined = product
    ? {
        name: product.name,
        categoryId: product.category.id,
        fabricType: product.fabricType,
        color: product.color,
        colorHex: product.colorHex,
        composition: product.composition,
        weightGsm: product.weightGsm,
        widthCm: product.widthCm,
        pricePerUnit: product.pricePerUnit,
        unit: product.unit,
        moq: product.moq,
        availability: product.availability,
        leadTimeDays: product.leadTimeDays,
        description: product.description,
        tags: product.tags,
        isActive: product.isActive,
      }
    : undefined

  async function handleSubmit(values: ProductFormValues) {
    try {
      if (isEdit && id) {
        await updateProduct.mutateAsync({ id, input: values })
        toast.success("Product updated")
      } else {
        const created = await createProduct.mutateAsync(values)
        toast.success("Product created — add photos to complete your listing.")
        navigate(`/supplier/inventory/${created.id}/edit`, { replace: true })
      }
    } catch {
      toast.error("Could not save the product. Try again.")
    }
  }

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <div>
        <Link
          to="/supplier/inventory"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm"
        >
          <ArrowLeft className="size-3.5" />
          Back to inventory
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          {isEdit ? "Edit product" : "Add product"}
        </h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <ProductForm
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            isSubmitting={createProduct.isPending || updateProduct.isPending}
            submitLabel={isEdit ? "Save changes" : "Create product"}
          />
        </CardContent>
      </Card>

      {isEdit && product && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Photos</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductImageUploader productId={product.id} images={product.images} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
