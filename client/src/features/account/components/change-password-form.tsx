import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useChangePassword } from "@/features/account/hooks/use-change-password"
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "@/features/account/schemas"
import { getErrorMessage } from "@/lib/errors"

export function ChangePasswordForm() {
  const changePassword = useChangePassword()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({ resolver: zodResolver(changePasswordSchema) })

  async function onSubmit(values: ChangePasswordFormValues) {
    try {
      await changePassword.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      })
      toast.success("Password updated")
      reset()
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not update your password. Try again."))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:max-w-sm">
        <Label htmlFor="currentPassword">Current password</Label>
        <Input
          id="currentPassword"
          type="password"
          autoComplete="current-password"
          {...register("currentPassword")}
        />
        {errors.currentPassword && (
          <p className="text-destructive text-xs">{errors.currentPassword.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2 sm:max-w-sm">
        <Label htmlFor="newPassword">New password</Label>
        <Input
          id="newPassword"
          type="password"
          autoComplete="new-password"
          {...register("newPassword")}
        />
        {errors.newPassword ? (
          <p className="text-destructive text-xs">{errors.newPassword.message}</p>
        ) : (
          <p className="text-muted-foreground text-xs">
            At least 8 characters, with uppercase, lowercase, a number, and a symbol.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2 sm:max-w-sm">
        <Label htmlFor="confirmPassword">Confirm new password</Label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-destructive text-xs">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={changePassword.isPending}
        className="mt-1 w-fit"
      >
        {changePassword.isPending ? "Updating..." : "Update password"}
      </Button>
    </form>
  )
}
