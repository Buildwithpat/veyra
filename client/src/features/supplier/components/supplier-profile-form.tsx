import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCategories } from "@/features/marketplace/hooks/use-categories"
import {
  supplierProfileSchema,
  type SupplierProfileFormValues,
} from "@/features/supplier/schemas"

interface SupplierProfileFormProps {
  defaultValues?: Partial<SupplierProfileFormValues>
  onSubmit: (values: SupplierProfileFormValues) => void | Promise<void>
  isSubmitting?: boolean
  submitLabel: string
}

function CategoryCheckboxGroup({
  values,
  onChange,
  error,
}: {
  values: string[]
  onChange: (values: string[]) => void
  error?: string
}) {
  const { data: categories = [] } = useCategories()

  function toggle(id: string) {
    onChange(values.includes(id) ? values.filter((v) => v !== id) : [...values, id])
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {categories.map((category) => (
          <Label
            key={category.id}
            className="flex cursor-pointer items-center gap-2 text-sm font-normal"
          >
            <Checkbox
              checked={values.includes(category.id)}
              onCheckedChange={() => toggle(category.id)}
            />
            {category.name}
          </Label>
        ))}
      </div>
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  )
}

export function SupplierProfileForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel,
}: SupplierProfileFormProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SupplierProfileFormValues>({
    resolver: zodResolver(supplierProfileSchema),
    defaultValues: {
      businessName: defaultValues?.businessName ?? "",
      description: defaultValues?.description ?? "",
      phone: defaultValues?.phone ?? "",
      addressLine1: defaultValues?.addressLine1 ?? "",
      addressLine2: defaultValues?.addressLine2 ?? "",
      city: defaultValues?.city ?? "",
      state: defaultValues?.state ?? "",
      postalCode: defaultValues?.postalCode ?? "",
      country: defaultValues?.country ?? "",
      operatingHours: defaultValues?.operatingHours ?? "",
      categories: defaultValues?.categories ?? [],
      defaultMoq: defaultValues?.defaultMoq,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="businessName">Business name</Label>
        <Input id="businessName" {...register("businessName")} />
        {errors.businessName && (
          <p className="text-destructive text-xs">{errors.businessName.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Business description</Label>
        <Textarea
          id="description"
          placeholder="Tell buyers what you make and what sets your mill apart."
          {...register("description")}
        />
        {errors.description && (
          <p className="text-destructive text-xs">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="phone">Business phone</Label>
          <Input id="phone" type="tel" {...register("phone")} />
          {errors.phone && (
            <p className="text-destructive text-xs">{errors.phone.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="operatingHours">Operating hours</Label>
          <Input
            id="operatingHours"
            placeholder="Mon–Fri, 9:00–18:00"
            {...register("operatingHours")}
          />
          {errors.operatingHours && (
            <p className="text-destructive text-xs">{errors.operatingHours.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="addressLine1">Address line 1</Label>
        <Input id="addressLine1" {...register("addressLine1")} />
        {errors.addressLine1 && (
          <p className="text-destructive text-xs">{errors.addressLine1.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="addressLine2">Address line 2 (optional)</Label>
        <Input id="addressLine2" {...register("addressLine2")} />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" {...register("city")} />
          {errors.city && (
            <p className="text-destructive text-xs">{errors.city.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="state">State / Province</Label>
          <Input id="state" {...register("state")} />
          {errors.state && (
            <p className="text-destructive text-xs">{errors.state.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="postalCode">Postal code</Label>
          <Input id="postalCode" {...register("postalCode")} />
          {errors.postalCode && (
            <p className="text-destructive text-xs">{errors.postalCode.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="country">Country</Label>
          <Input id="country" {...register("country")} />
          {errors.country && (
            <p className="text-destructive text-xs">{errors.country.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Fabric categories you supply</Label>
        <Controller
          control={control}
          name="categories"
          render={({ field }) => (
            <CategoryCheckboxGroup
              values={field.value}
              onChange={field.onChange}
              error={errors.categories?.message}
            />
          )}
        />
      </div>

      <div className="flex flex-col gap-2 sm:w-1/2">
        <Label htmlFor="defaultMoq">Typical minimum order quantity</Label>
        <Input
          id="defaultMoq"
          type="number"
          min={1}
          {...register("defaultMoq", { valueAsNumber: true })}
        />
        {errors.defaultMoq && (
          <p className="text-destructive text-xs">{errors.defaultMoq.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} size="lg" className="w-fit">
        {isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  )
}
