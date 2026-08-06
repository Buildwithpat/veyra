import { useState } from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForgotPassword } from "@/features/auth/hooks/use-forgot-password"
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/features/auth/schemas"
import { useDocumentTitle } from "@/hooks/use-document-title"
import { getErrorMessage } from "@/lib/errors"

const fieldVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
}

export function ForgotPasswordPage() {
  useDocumentTitle("Forgot Password")
  const forgotPassword = useForgotPassword()
  const [resetUrl, setResetUrl] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({ resolver: zodResolver(forgotPasswordSchema) })

  async function onSubmit(values: ForgotPasswordFormValues) {
    try {
      const data = await forgotPassword.mutateAsync(values)
      setResetUrl(data?.resetUrl ?? null)
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not generate a reset link. Try again."))
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
          Enter your email and we&apos;ll generate a reset link.
        </p>
      </motion.div>

      {resetUrl ? (
        <motion.div
          variants={fieldVariants}
          transition={{ duration: 0.35 }}
          className="border-border bg-surface mt-8 flex flex-col gap-3 rounded-lg border p-4"
        >
          <p className="text-foreground text-sm">
            No email service is configured in this dev environment, so here&apos;s your
            reset link directly:
          </p>
          <Link
            to={resetUrl.replace(window.location.origin, "")}
            className="text-primary text-sm font-medium break-all underline-offset-4 hover:underline"
          >
            {resetUrl}
          </Link>
          <p className="text-muted-foreground text-xs">Expires in 1 hour.</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4">
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
              {...register("email")}
            />
            {errors.email && (
              <p className="text-destructive text-xs">{errors.email.message}</p>
            )}
          </motion.div>

          <motion.div variants={fieldVariants} transition={{ duration: 0.35 }}>
            <Button
              type="submit"
              disabled={forgotPassword.isPending}
              size="lg"
              className="group shadow-primary/25 mt-2 w-full gap-2 shadow-lg"
            >
              {forgotPassword.isPending ? "Generating link..." : "Send reset link"}
              {!forgotPassword.isPending && (
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              )}
            </Button>
          </motion.div>
        </form>
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
