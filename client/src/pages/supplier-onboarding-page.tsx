import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useUpdateProfile } from "@/features/account/hooks/use-update-profile"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { SupplierProfileForm } from "@/features/supplier/components/supplier-profile-form"
import type { SupplierProfileFormValues } from "@/features/supplier/schemas"
import { useDocumentTitle } from "@/hooks/use-document-title"

export function SupplierOnboardingPage() {
  useDocumentTitle("Complete Your Business Profile")
  const { user } = useAuth()
  const navigate = useNavigate()
  const updateProfile = useUpdateProfile()

  async function handleSubmit(values: SupplierProfileFormValues) {
    try {
      await updateProfile.mutateAsync({ ...values, completeOnboarding: true })
      toast.success("Welcome to Veyra — your supplier profile is set up.")
      navigate("/supplier/dashboard", { replace: true })
    } catch {
      toast.error("Could not save your profile. Try again.")
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            Welcome{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
          </CardTitle>
          <CardDescription>
            Tell buyers about your business so we can get your first listings in front of
            them.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SupplierProfileForm
            onSubmit={handleSubmit}
            isSubmitting={updateProfile.isPending}
            submitLabel="Continue to dashboard"
          />
        </CardContent>
      </Card>
    </div>
  )
}
