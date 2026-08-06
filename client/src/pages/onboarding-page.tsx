import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BuyerProfileForm } from "@/features/account/components/buyer-profile-form"
import { useUpdateProfile } from "@/features/account/hooks/use-update-profile"
import type { BuyerProfileFormValues } from "@/features/account/schemas"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { useDocumentTitle } from "@/hooks/use-document-title"

export function OnboardingPage() {
  useDocumentTitle("Complete Your Profile")
  const { user } = useAuth()
  const navigate = useNavigate()
  const updateProfile = useUpdateProfile()

  async function handleSubmit(values: BuyerProfileFormValues) {
    try {
      await updateProfile.mutateAsync({ ...values, completeOnboarding: true })
      toast.success("Welcome to Veyra — your profile is set up.")
      navigate("/marketplace", { replace: true })
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
            Tell us about your sourcing needs so we can tailor recommendations for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BuyerProfileForm
            onSubmit={handleSubmit}
            isSubmitting={updateProfile.isPending}
            submitLabel="Continue to marketplace"
          />
        </CardContent>
      </Card>
    </div>
  )
}
