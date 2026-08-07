import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForgotPassword } from "@/features/auth/hooks/use-forgot-password"
import { useResetPassword } from "@/features/auth/hooks/use-reset-password"
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  type ForgotPasswordFormValues,
  type ResetPasswordFormValues,
} from "@/features/auth/schemas"
import { useDocumentTitle } from "@/hooks/use-document-title"
import { getErrorMessage } from "@/lib/errors"

const fieldVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
}

export function ForgotPasswordPage() {
  useDocumentTitle("Forgot Password")
  const navigate = useNavigate()
  const forgotPassword = useForgotPassword()
  const resetPassword = useResetPassword()
  const [otp, setOtp] = useState<string | null>(null)
  const [expiresInMinutes, setExpiresInMinutes] = useState(10)

  const emailForm = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const resetForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  })

  async function onRequestCode(values: ForgotPasswordFormValues) {
    try {
      const data = await forgotPassword.mutateAsync(values)
      if (data?.otp) {
        setOtp(data.otp)
        setExpiresInMinutes(data.expiresInMinutes ?? 10)
        resetForm.setValue("otp", data.otp)
      } else {
        // Production without a delivery provider wired up — nothing to show.
        toast.success("If that email exists, a code has been sent.")
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not generate a code. Try again."))
    }
  }

  async function onReset(values: ResetPasswordFormValues) {
    try {
      await resetPassword.mutateAsync({ otp: values.otp, newPassword: values.newPassword })
      toast.success("Password updated — sign in with your new password.")
      navigate("/login", { replace: true })
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not reset your password. Try again."))
    }
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
          Forgot password
        </h1>
        <p className="text-muted-foreground mt-1.5 text-sm">
          {otp
            ? "Enter the verification code and choose a new password."
            : "Enter your email and we'll generate a verification code."}
        </p>
      </motion.div>

      {!otp ? (
        <form
          onSubmit={emailForm.handleSubmit(onRequestCode)}
          className="mt-8 flex flex-col gap-4"
        >
          <motion.div
            variants={fieldVariants}
            transition={{ duration: 0.35 }}
            className="flex flex-col gap-2"
          >
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              className="h-10"
              {...emailForm.register("email")}
            />
            {emailForm.formState.errors.email && (
              <p className="text-destructive text-xs">
                {emailForm.formState.errors.email.message}
              </p>
            )}
          </motion.div>

          <motion.div variants={fieldVariants} transition={{ duration: 0.35 }}>
            <Button
              type="submit"
              disabled={forgotPassword.isPending}
              size="lg"
              className="group shadow-primary/25 mt-2 w-full gap-2 shadow-lg"
            >
              {forgotPassword.isPending ? "Generating code..." : "Send verification code"}
              {!forgotPassword.isPending && (
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              )}
            </Button>
          </motion.div>
        </form>
      ) : (
        <div className="mt-8 flex flex-col gap-5">
          {/* No email/SMS provider is wired up in this dev environment, so
              the code is surfaced directly here instead of being sent
              out-of-band — see the comment on forgotPassword in
              auth.controller.ts for why. */}
          <motion.div
            variants={fieldVariants}
            transition={{ duration: 0.35 }}
            className="border-border bg-surface flex flex-col items-center gap-2 rounded-lg border p-5 text-center"
          >
            <span className="text-primary flex items-center gap-1.5 text-xs font-medium">
              <ShieldCheck className="size-3.5" />
              Your verification code
            </span>
            <span className="text-foreground font-mono text-3xl font-semibold tracking-[0.4em]">
              {otp}
            </span>
            <span className="text-muted-foreground text-xs">
              Expires in {expiresInMinutes} minutes. No email service is configured in this dev
              environment, so it's shown here directly instead of being sent to your inbox.
            </span>
          </motion.div>

          <form
            onSubmit={resetForm.handleSubmit(onReset)}
            className="flex flex-col gap-4"
          >
            <motion.div
              variants={fieldVariants}
              transition={{ duration: 0.35 }}
              className="flex flex-col gap-2"
            >
              <Label htmlFor="otp">Verification code</Label>
              <Input
                id="otp"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                className="h-10 font-mono tracking-widest"
                {...resetForm.register("otp")}
              />
              {resetForm.formState.errors.otp && (
                <p className="text-destructive text-xs">
                  {resetForm.formState.errors.otp.message}
                </p>
              )}
            </motion.div>

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
                {...resetForm.register("newPassword")}
              />
              {resetForm.formState.errors.newPassword ? (
                <p className="text-destructive text-xs">
                  {resetForm.formState.errors.newPassword.message}
                </p>
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
                {...resetForm.register("confirmPassword")}
              />
              {resetForm.formState.errors.confirmPassword && (
                <p className="text-destructive text-xs">
                  {resetForm.formState.errors.confirmPassword.message}
                </p>
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
        </div>
      )}

      <motion.p
        variants={fieldVariants}
        transition={{ duration: 0.35 }}
        className="text-muted-foreground mt-8 flex items-center justify-center gap-1.5 text-center text-sm"
      >
        <ArrowLeft className="size-3.5" />
        <Link to="/login" className="text-foreground underline-offset-4 hover:underline">
          Back to sign in
        </Link>
      </motion.p>
    </motion.div>
  )
}
