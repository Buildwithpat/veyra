import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useResetPassword } from "@/features/auth/hooks/use-reset-password"
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/features/auth/schemas"
import { useDocumentTitle } from "@/hooks/use-document-title"
import { getErrorMessage } from "@/lib/errors"

const fieldVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
}

export function ResetPasswordPage() {
  useDocumentTitle("Reset Password")
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")
  const navigate = useNavigate()
  const resetPassword = useResetPassword()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({ resolver: zodResolver(resetPasswordSchema) })

  async function onSubmit(values: ResetPasswordFormValues) {
    if (!token) return
    try {
      await resetPassword.mutateAsync({ token, newPassword: values.newPassword })
      toast.success("Password updated — sign in with your new password.")
      navigate("/login", { replace: true })
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not reset your password. Try again."))
    }
  }

  if (!token) {
    return (
      <div>
        <span className="bg-destructive block h-1 w-8 rounded-full" aria-hidden />
        <h1 className="font-display text-foreground mt-4 text-3xl font-semibold tracking-tight">
          Invalid link
        </h1>
        <p className="text-muted-foreground mt-1.5 text-sm">
          This reset link is missing or malformed.
        </p>
        <Link
          to="/forgot-password"
          className="text-primary mt-6 inline-block text-sm font-medium underline-offset-4 hover:underline"
        >
          Request a new one
        </Link>
      </div>
    )
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.06, delayChildren: 0.05 }}
    >
      <motion.div variants={fieldVariants} transition={{ duration: 0.35 }}>
        <span className="bg-primary block h-1 w-8 rounded-full" aria-hidden />
        <h1 className="font-display text-foreground mt-4 text-3xl font-semibold tracking-tight">
          Set a new password
        </h1>
        <p className="text-muted-foreground mt-1.5 text-sm">
          Choose a new password for your Veyra account.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4">
        <motion.div
          variants={fieldVariants}
          transition={{ duration: 0.35 }}
          className="flex flex-col gap-2"
        >
          <Label htmlFor="newPassword">New password</Label>
          <Input
            id="newPassword"
            type="password"
            autoComplete="new-password"
            className="h-10"
            {...register("newPassword")}
          />
          {errors.newPassword ? (
            <p className="text-destructive text-xs">{errors.newPassword.message}</p>
          ) : (
            <p className="text-muted-foreground text-xs">
              At least 8 characters, with uppercase, lowercase, a number, and a symbol.
            </p>
          )}
        </motion.div>

        <motion.div
          variants={fieldVariants}
          transition={{ duration: 0.35 }}
          className="flex flex-col gap-2"
        >
          <Label htmlFor="confirmPassword">Confirm new password</Label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            className="h-10"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-destructive text-xs">{errors.confirmPassword.message}</p>
          )}
        </motion.div>

        <motion.div variants={fieldVariants} transition={{ duration: 0.35 }}>
          <Button
            type="submit"
            disabled={resetPassword.isPending}
            size="lg"
            className="group shadow-primary/25 mt-2 w-full gap-2 shadow-lg"
          >
            {resetPassword.isPending ? "Updating..." : "Reset password"}
            {!resetPassword.isPending && (
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            )}
          </Button>
        </motion.div>
      </form>
    </motion.div>
  )
}
