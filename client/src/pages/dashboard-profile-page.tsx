import { toast } from "sonner"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { BuyerProfileForm } from "@/features/account/components/buyer-profile-form"
import { ChangePasswordForm } from "@/features/account/components/change-password-form"
import { useUpdateProfile } from "@/features/account/hooks/use-update-profile"
import type { BuyerProfileFormValues } from "@/features/account/schemas"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { useDocumentTitle } from "@/hooks/use-document-title"

export function DashboardProfilePage() {
  useDocumentTitle("Profile")
  const { user } = useAuth()
  const updateProfile = useUpdateProfile()

  async function handleSubmit(values: BuyerProfileFormValues) {
    try {
      await updateProfile.mutateAsync(values)
      toast.success("Profile updated")
    } catch {
      toast.error("Could not update your profile. Try again.")
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="text-muted-foreground text-sm">
          Manage your account and sourcing preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Account</CardTitle>
          <CardDescription>Basic account details</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Name</span>
            <span className="text-foreground font-medium">{user?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email</span>
            <span className="text-foreground font-medium">{user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Account type</span>
            <span className="text-foreground font-medium capitalize">{user?.role}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Password</CardTitle>
          <CardDescription>Update the password you sign in with</CardDescription>
        </CardHeader>
        <CardContent>
          <Separator className="mb-6" />
          <ChangePasswordForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sourcing preferences</CardTitle>
          <CardDescription>
            Used to tailor marketplace recommendations to your business.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Separator className="mb-6" />
          <BuyerProfileForm
            defaultValues={user?.buyerProfile}
            onSubmit={handleSubmit}
            isSubmitting={updateProfile.isPending}
            submitLabel="Save changes"
          />
        </CardContent>
      </Card>
    </div>
  )
}
