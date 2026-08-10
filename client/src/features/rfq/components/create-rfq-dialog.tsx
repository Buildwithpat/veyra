import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useCategories } from "@/features/marketplace/hooks/use-categories"
import { useCreateRfq } from "@/features/rfq/hooks/use-create-rfq"
import {
  createRfqSchema,
  type CreateRfqFormInput,
  type CreateRfqFormValues,
} from "@/features/rfq/schemas"

interface CreateRfqDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateRfqDialog({ open, onOpenChange }: CreateRfqDialogProps) {
  const { data: categories = [] } = useCategories()
  const createRfq = useCreateRfq()

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateRfqFormInput, unknown, CreateRfqFormValues>({
    resolver: zodResolver(createRfqSchema),
    defaultValues: {
      categorySlug: "",
      title: "",
      description: "",
      quantity: undefined,
      unit: "meter",
      targetPriceMax: undefined,
      deadline: "",
    },
  })

  function handleOpenChange(next: boolean) {
    if (!next) reset()
    onOpenChange(next)
  }

  async function onSubmit(values: CreateRfqFormValues) {
    try {
      await createRfq.mutateAsync({
        categorySlug: values.categorySlug,
        title: values.title,
        description: values.description,
        quantity: values.quantity,
        unit: values.unit,
        targetPriceMax: values.targetPriceMax,
        deadline: values.deadline || undefined,
      })
      handleOpenChange(false)
    } catch {
      // toast is handled by the mutation's onError
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Post a sourcing request</DialogTitle>
          <DialogDescription>
            Describe what you need once — every supplier active in that category can
            submit a quote.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Category</Label>
            <Controller
              control={control}
              name="categorySlug"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.categorySlug && (
              <p className="text-destructive text-xs">{errors.categorySlug.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="rfq-title">Title</Label>
            <Input
              id="rfq-title"
              placeholder="e.g. 250 GSM black cotton jersey, 500m"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-destructive text-xs">{errors.title.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="rfq-description">Spec / description</Label>
            <Textarea
              id="rfq-description"
              placeholder="Describe the fabric, finish, certifications, and any other requirements"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-destructive text-xs">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="rfq-quantity">Quantity</Label>
              <Input id="rfq-quantity" type="number" step="any" {...register("quantity")} />
              {errors.quantity && (
                <p className="text-destructive text-xs">{errors.quantity.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Unit</Label>
              <Controller
                control={control}
                name="unit"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meter">Meter</SelectItem>
                      <SelectItem value="yard">Yard</SelectItem>
                      <SelectItem value="kg">Kilogram</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="rfq-targetPriceMax">Target price / unit (optional)</Label>
              <Input
                id="rfq-targetPriceMax"
                type="number"
                step="any"
                {...register("targetPriceMax")}
              />
              {errors.targetPriceMax && (
                <p className="text-destructive text-xs">
                  {errors.targetPriceMax.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="rfq-deadline">Need by (optional)</Label>
              <Input id="rfq-deadline" type="date" {...register("deadline")} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createRfq.isPending}>
              {createRfq.isPending ? "Posting..." : "Post RFQ"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
