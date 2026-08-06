import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Package, Plus } from "lucide-react"
import { toast } from "sonner"

import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { InventoryRow } from "@/features/supplier/components/inventory-row"
import { useDeleteProduct } from "@/features/supplier/hooks/use-delete-product"
import { useMyProducts } from "@/features/supplier/hooks/use-my-products"
import { useUpdateProduct } from "@/features/supplier/hooks/use-update-product"
import type { Product } from "@/features/marketplace/types"
import { useDocumentTitle } from "@/hooks/use-document-title"

export function SupplierInventoryPage() {
  useDocumentTitle("Inventory")
  const { data: products, isPending } = useMyProducts()
  const updateProduct = useUpdateProduct()
  const deleteProduct = useDeleteProduct()
  const navigate = useNavigate()
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)

  function handleToggleActive(product: Product) {
    updateProduct.mutate(
      { id: product.id, input: { isActive: !product.isActive } },
      {
        onSuccess: () =>
          toast.success(product.isActive ? "Listing hidden" : "Listing activated"),
        onError: () => toast.error("Could not update the listing. Try again."),
      },
    )
  }

  async function handleConfirmDelete() {
    if (!productToDelete) return
    try {
      await deleteProduct.mutateAsync(productToDelete.id)
      toast.success("Product deleted")
    } catch {
      toast.error("Could not delete the product. Try again.")
    } finally {
      setProductToDelete(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground text-sm">
            Manage your fabric listings and stock status.
          </p>
        </div>
        <Button asChild size="sm" className="gap-2">
          <Link to="/supplier/inventory/new">
            <Plus className="size-4" />
            Add product
          </Link>
        </Button>
      </div>

      {isPending ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[82px] w-full rounded-xl" />
          ))}
        </div>
      ) : !products || products.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products yet"
          description="Add your first fabric listing to start reaching buyers."
          actionLabel="Add product"
          onAction={() => navigate("/supplier/inventory/new")}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {products.map((product) => (
            <InventoryRow
              key={product.id}
              product={product}
              onToggleActive={handleToggleActive}
              onDelete={setProductToDelete}
            />
          ))}
        </div>
      )}

      <Dialog
        open={Boolean(productToDelete)}
        onOpenChange={(open) => !open && setProductToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete product</DialogTitle>
            <DialogDescription>
              This will permanently remove &ldquo;{productToDelete?.name}&rdquo; from your
              inventory and the marketplace. This can&apos;t be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProductToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteProduct.isPending}
            >
              {deleteProduct.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
