import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useCategories } from "@/features/marketplace/hooks/use-categories"
import { productSchema, type ProductFormValues } from "@/features/supplier/schemas"

interface ProductFormProps {
  defaultValues?: Partial<ProductFormValues>
  onSubmit: (values: ProductFormValues) => void | Promise<void>
  isSubmitting?: boolean
  submitLabel: string
}

function TagInput({
  values,
  onChange,
}: {
  values: string[]
  onChange: (values: string[]) => void
}) {
  const [draft, setDraft] = useState("")

  function commit() {
    const tag = draft.trim().toLowerCase()
    if (tag && !values.includes(tag)) onChange([...values, tag])
    setDraft("")
  }

  return (
    <div className="border-input flex flex-wrap items-center gap-2 rounded-md border px-3 py-2">
      {values.map((tag) => (
        <span
          key={tag}
          className="bg-accent text-accent-foreground flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs"
        >
          {tag}
          <button
            type="button"
            onClick={() => onChange(values.filter((t) => t !== tag))}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="size-3" />
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault()
            commit()
          } else if (e.key === "Backspace" && !draft && values.length > 0) {
            onChange(values.slice(0, -1))
          }
        }}
        onBlur={commit}
        placeholder={values.length === 0 ? "Type a tag and press Enter" : ""}
        className="placeholder:text-muted-foreground min-w-32 flex-1 bg-transparent text-sm outline-none"
      />
    </div>
  )
}

export function ProductForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel,
}: ProductFormProps) {
  const { data: categories = [] } = useCategories()

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      categoryId: defaultValues?.categoryId ?? "",
      fabricType: defaultValues?.fabricType ?? "",
      color: defaultValues?.color ?? "",
      colorHex: defaultValues?.colorHex ?? "#8A9A7B",
      composition: defaultValues?.composition ?? "",
      weightGsm: defaultValues?.weightGsm,
      widthCm: defaultValues?.widthCm,
      pricePerUnit: defaultValues?.pricePerUnit,
      unit: defaultValues?.unit ?? "meter",
      moq: defaultValues?.moq,
      availability: defaultValues?.availability ?? "in-stock",
      leadTimeDays: defaultValues?.leadTimeDays,
      description: defaultValues?.description ?? "",
      tags: defaultValues?.tags ?? [],
      isActive: defaultValues?.isActive ?? true,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="name">Product name</Label>
          <Input id="name" {...register("name")} />
          {errors.name && (
            <p className="text-destructive text-xs">{errors.name.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label>Category</Label>
          <Controller
            control={control}
            name="categoryId"
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
          {errors.categoryId && (
            <p className="text-destructive text-xs">{errors.categoryId.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="fabricType">Fabric type</Label>
          <Input id="fabricType" placeholder="e.g. Poplin" {...register("fabricType")} />
          {errors.fabricType && (
            <p className="text-destructive text-xs">{errors.fabricType.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="color">Color name</Label>
          <Input id="color" placeholder="e.g. Ivory White" {...register("color")} />
          {errors.color && (
            <p className="text-destructive text-xs">{errors.color.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="colorHex">Swatch color</Label>
          <div className="flex items-center gap-2">
            <Input id="colorHex" className="flex-1" {...register("colorHex")} />
            <Controller
              control={control}
              name="colorHex"
              render={({ field }) => (
                <input
                  type="color"
                  value={/^#[0-9A-Fa-f]{6}$/.test(field.value) ? field.value : "#8A9A7B"}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="border-input size-9 shrink-0 cursor-pointer rounded-md border bg-transparent"
                />
              )}
            />
          </div>
          {errors.colorHex && (
            <p className="text-destructive text-xs">{errors.colorHex.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="composition">Composition</Label>
          <Input
            id="composition"
            placeholder="e.g. 100% Combed Cotton"
            {...register("composition")}
          />
          {errors.composition && (
            <p className="text-destructive text-xs">{errors.composition.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="weightGsm">Weight (gsm)</Label>
          <Input id="weightGsm" type="number" step="1" {...register("weightGsm")} />
          {errors.weightGsm && (
            <p className="text-destructive text-xs">{errors.weightGsm.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="widthCm">Width (cm)</Label>
          <Input id="widthCm" type="number" step="1" {...register("widthCm")} />
          {errors.widthCm && (
            <p className="text-destructive text-xs">{errors.widthCm.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="pricePerUnit">Price per unit (USD)</Label>
          <Input
            id="pricePerUnit"
            type="number"
            step="0.01"
            {...register("pricePerUnit")}
          />
          {errors.pricePerUnit && (
            <p className="text-destructive text-xs">{errors.pricePerUnit.message}</p>
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

        <div className="flex flex-col gap-2">
          <Label htmlFor="moq">MOQ</Label>
          <Input id="moq" type="number" step="1" {...register("moq")} />
          {errors.moq && <p className="text-destructive text-xs">{errors.moq.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="leadTimeDays">Lead time (days)</Label>
          <Input id="leadTimeDays" type="number" step="1" {...register("leadTimeDays")} />
          {errors.leadTimeDays && (
            <p className="text-destructive text-xs">{errors.leadTimeDays.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label>Availability</Label>
          <Controller
            control={control}
            name="availability"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in-stock">In stock</SelectItem>
                  <SelectItem value="limited">Limited stock</SelectItem>
                  <SelectItem value="made-to-order">Made to order</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={4} {...register("description")} />
        {errors.description && (
          <p className="text-destructive text-xs">{errors.description.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label>Tags</Label>
        <Controller
          control={control}
          name="tags"
          render={({ field }) => (
            <TagInput values={field.value} onChange={field.onChange} />
          )}
        />
      </div>

      <div className="border-border flex items-center justify-between rounded-md border p-4">
        <div>
          <p className="text-foreground text-sm font-medium">Listing active</p>
          <p className="text-muted-foreground text-xs">
            Inactive listings are hidden from the marketplace.
          </p>
        </div>
        <Controller
          control={control}
          name="isActive"
          render={({ field }) => (
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          )}
        />
      </div>

      <Button type="submit" disabled={isSubmitting} size="lg" className="w-fit">
        {isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  )
}
