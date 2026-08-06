import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { loginSchema, type LoginFormValues } from "@/features/auth/schemas"
import { useDocumentTitle } from "@/hooks/use-document-title"

const fieldVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
}

// Must match the accounts created by server/src/scripts/run-seed.ts.
const DEMO_BUYER_CREDENTIALS: LoginFormValues = {
  email: "demo.buyer@veyra.dev",
  password: "DemoBuyer123!",
}
const DEMO_SELLER_CREDENTIALS: LoginFormValues = {
  email: "contact@anantaratextiles.example",
  password: "Supplier123!",
}

export function LoginPage() {
  useDocumentTitle("Sign In")
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })

  async function attemptLogin(values: LoginFormValues, failureMessage: string) {
    setIsSubmitting(true)
    try {
      await login(values)
      const redirectTo = (location.state as { from?: Location })?.from?.pathname ?? "/"
      navigate(redirectTo, { replace: true })
    } catch {
      toast.error(failureMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const onSubmit = (values: LoginFormValues) =>
    attemptLogin(values, "Invalid email or password")

  const handleDemoBuyerLogin = () =>
    attemptLogin(DEMO_BUYER_CREDENTIALS, "Demo buyer not found — seed the database first.")

  const handleDemoSellerLogin = () =>
    attemptLogin(DEMO_SELLER_CREDENTIALS, "Demo seller not found — seed the database first.")

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.06, delayChildren: 0.05 }}
    >
      <motion.div variants={fieldVariants} transition={{ duration: 0.35 }}>
        <span className="bg-primary block h-1 w-8 rounded-full" aria-hidden />
        <h1 className="font-display text-foreground mt-4 text-3xl font-semibold tracking-tight">
          Welcome back
        </h1>
        <p className="text-muted-foreground mt-1.5 text-sm">
          Sign in to your Veyra account to keep sourcing.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4">
        <motion.div variants={fieldVariants} transition={{ duration: 0.35 }} className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            className="h-10"
            {...register("email")}
          />
          {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
        </motion.div>

        <motion.div variants={fieldVariants} transition={{ duration: 0.35 }} className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              to="/forgot-password"
              className="text-muted-foreground text-xs underline-offset-4 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            className="h-10"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-destructive text-xs">{errors.password.message}</p>
          )}
        </motion.div>

        <motion.div variants={fieldVariants} transition={{ duration: 0.35 }}>
          <Button
            type="submit"
            disabled={isSubmitting}
            size="lg"
            className="group shadow-primary/25 mt-2 w-full gap-2 shadow-lg"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
            {!isSubmitting && (
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            )}
          </Button>
        </motion.div>
      </form>

      <motion.div
        variants={fieldVariants}
        transition={{ duration: 0.35 }}
        className="mt-6 flex items-center gap-3"
      >
        <span className="bg-border h-px flex-1" aria-hidden />
        <span className="text-muted-foreground text-xs">or</span>
        <span className="bg-border h-px flex-1" aria-hidden />
      </motion.div>

      <motion.div
        variants={fieldVariants}
        transition={{ duration: 0.35 }}
        className="mt-6 flex flex-col gap-2"
      >
        <Button
          type="button"
          variant="outline"
          size="lg"
          disabled={isSubmitting}
          onClick={handleDemoBuyerLogin}
          className="w-full"
        >
          Demo buyer
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          disabled={isSubmitting}
          onClick={handleDemoSellerLogin}
          className="w-full"
        >
          Demo seller
        </Button>
      </motion.div>

      <motion.p
        variants={fieldVariants}
        transition={{ duration: 0.35 }}
        className="text-muted-foreground mt-8 text-center text-sm"
      >
        Don&apos;t have an account?{" "}
        <Link to="/register" className="text-foreground underline-offset-4 hover:underline">
          Create one
        </Link>
      </motion.p>
    </motion.div>
  )
}
