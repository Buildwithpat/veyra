import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  budgetRangeOptions,
  businessTypeOptions,
  industryOptions,
  moqPreferenceOptions,
} from "@/features/account/options"
import {
  buyerProfileSchema,
  type BuyerProfileFormValues,
} from "@/features/account/schemas"
import { useCategories } from "@/features/marketplace/hooks/use-categories"

interface BuyerProfileFormProps {
  defaultValues?: Partial<BuyerProfileFormValues>
  onSubmit: (values: BuyerProfileFormValues) => void | Promise<void>
  isSubmitting?: boolean
  submitLabel: string
}

function CheckboxGroup({
  values,
  onChange,
  error,
}: {
  values: string[]
  onChange: (values: string[]) => void
  error?: string
}) {
  const { data: categories = [] } = useCategories()

  function toggle(name: string) {
    onChange(values.includes(name) ? values.filter((v) => v !== name) : [...values, name])
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
              checked={values.includes(category.name)}
              onCheckedChange={() => toggle(category.name)}
            />
            {category.name}
          </Label>
        ))}
      </div>
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  )
}

/** Picks the initial <Select> value for a field whose options include a
 * free-text "Other" escape hatch — a saved value outside the known list
 * (e.g. a previously typed custom entry) should reopen as "Other" with the
 * text preserved, not render as blank. */
function initialSelectValue(value: string | undefined, options: string[]) {
  if (!value) return ""
  return options.includes(value) ? value : "Other"
}

function initialOtherText(value: string | undefined, options: string[]) {
  if (!value || options.includes(value)) return ""
  return value
}

export function BuyerProfileForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel,
}: BuyerProfileFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BuyerProfileFormValues>({
    resolver: zodResolver(buyerProfileSchema),
    defaultValues: {
      businessType: initialSelectValue(defaultValues?.businessType, businessTypeOptions),
      industry: initialSelectValue(defaultValues?.industry, industryOptions),
      interests: defaultValues?.interests ?? [],
      preferredFabrics: defaultValues?.preferredFabrics ?? [],
      budgetRange: defaultValues?.budgetRange ?? "",
      moqPreference: defaultValues?.moqPreference ?? "",
    },
  })

  const [businessTypeOther, setBusinessTypeOther] = useState(() =>
    initialOtherText(defaultValues?.businessType, businessTypeOptions),
  )
  const [industryOther, setIndustryOther] = useState(() =>
    initialOtherText(defaultValues?.industry, industryOptions),
  )
  const [otherErrors, setOtherErrors] = useState<{ businessType?: string; industry?: string }>({})

  function submitWithOtherValues(values: BuyerProfileFormValues) {
    const nextErrors: typeof otherErrors = {}
    if (values.businessType === "Other" && !businessTypeOther.trim()) {
      nextErrors.businessType = "Describe your business type"
    }
    if (values.industry === "Other" && !industryOther.trim()) {
      nextErrors.industry = "Describe your industry"
    }
    if (nextErrors.businessType || nextErrors.industry) {
      setOtherErrors(nextErrors)
      return
    }
    setOtherErrors({})

    return onSubmit({
      ...values,
      businessType: values.businessType === "Other" ? businessTypeOther.trim() : values.businessType,
      industry: values.industry === "Other" ? industryOther.trim() : values.industry,
    })
  }

  return (
    <form onSubmit={handleSubmit(submitWithOtherValues)} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label>Business type</Label>
          <Controller
            control={control}
            name="businessType"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  {businessTypeOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.businessType && (
            <p className="text-destructive text-xs">{errors.businessType.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label>Industry</Label>
          <Controller
            control={control}
            name="industry"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {industryOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.industry && (
            <p className="text-destructive text-xs">{errors.industry.message}</p>
          )}
        </div>
      </div>

      <Controller
        control={control}
        name="businessType"
        render={({ field }) =>
          field.value === "Other" ? (
            <div className="-mt-3 flex flex-col gap-2">
              <Label htmlFor="businessTypeOther">Describe your business type</Label>
              <Input
                id="businessTypeOther"
                value={businessTypeOther}
                onChange={(e) => setBusinessTypeOther(e.target.value)}
                placeholder="e.g. Home décor studio"
                className="h-10"
              />
              {otherErrors.businessType && (
                <p className="text-destructive text-xs">{otherErrors.businessType}</p>
              )}
            </div>
          ) : (
            <></>
          )
        }
      />

      <Controller
        control={control}
        name="industry"
        render={({ field }) =>
          field.value === "Other" ? (
            <div className="-mt-3 flex flex-col gap-2">
              <Label htmlFor="industryOther">Describe your industry</Label>
              <Input
                id="industryOther"
                value={industryOther}
                onChange={(e) => setIndustryOther(e.target.value)}
                placeholder="e.g. Hospitality linens"
                className="h-10"
              />
              {otherErrors.industry && (
                <p className="text-destructive text-xs">{otherErrors.industry}</p>
              )}
            </div>
          ) : (
            <></>
          )
        }
      />

      <div className="flex flex-col gap-2">
        <Label>Product interests</Label>
        <p className="text-muted-foreground text-xs">
          What kinds of fabrics are you generally sourcing?
        </p>
        <Controller
          control={control}
          name="interests"
          render={({ field }) => (
            <CheckboxGroup
              values={field.value}
              onChange={field.onChange}
              error={errors.interests?.message}
            />
          )}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Preferred fabric categories</Label>
        <p className="text-muted-foreground text-xs">
          We'll prioritize these in recommendations and search.
        </p>
        <Controller
          control={control}
          name="preferredFabrics"
          render={({ field }) => (
            <CheckboxGroup
              values={field.value}
              onChange={field.onChange}
              error={errors.preferredFabrics?.message}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label>Monthly sourcing budget</Label>
          <Controller
            control={control}
            name="budgetRange"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  {budgetRangeOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.budgetRange && (
            <p className="text-destructive text-xs">{errors.budgetRange.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label>MOQ preference</Label>
          <Controller
            control={control}
            name="moqPreference"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select MOQ preference" />
                </SelectTrigger>
                <SelectContent>
                  {moqPreferenceOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.moqPreference && (
            <p className="text-destructive text-xs">{errors.moqPreference.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} size="lg" className="w-fit">
        {isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  )
}
