import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { ArrowRight, Building2, ShoppingBag, Sparkles } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { loginSchema, type LoginFormValues } from "@/features/auth/schemas"
import type { User, UserRole } from "@/features/auth/types"
import { useDocumentTitle } from "@/hooks/use-document-title"
import { cn } from "@/lib/utils"

const fieldVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
}

// Must match the accounts created by server/src/scripts/run-seed.ts.
const DEMO_CREDENTIALS: Record<UserRole, LoginFormValues> = {
  buyer: { email: "demo.buyer@veyra.dev", password: "DemoBuyer123!" },
  supplier: { email: "contact@anantaratextiles.example", password: "Supplier123!" },
}

const roleOptions: Array<{
  value: UserRole
  label: string
  description: string
  icon: typeof ShoppingBag
}> = [
  {
    value: "buyer",
    label: "Buyer",
    description: "Source fabrics",
    icon: ShoppingBag,
  },
  {
    value: "supplier",
    label: "Supplier",
    description: "Sell fabrics",
    icon: Building2,
  },
]

function dashboardPathForRole(role: UserRole) {
  return role === "supplier" ? "/supplier/dashboard" : "/dashboard"
}

export function LoginPage() {
  useDocumentTitle("Sign In")
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedRole, setSelectedRole] = useState<UserRole>("buyer")

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })

  async function attemptLogin(values: LoginFormValues, failureMessage: string) {
    setIsSubmitting(true)
    try {
      const user: User = await login(values)
      // The account's real role is the source of truth for where to land —
      // the toggle above is a UX affordance (and drives the demo prefill),
      // not proof of which account this actually is.
      const redirectTo =
        (location.state as { from?: Location })?.from?.pathname ?? dashboardPathForRole(user.role)
      navigate(redirectTo, { replace: true })
    } catch {
      toast.error(failureMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const onSubmit = (values: LoginFormValues) =>
    attemptLogin(values, "Invalid email or password")

  function handleSelectRole(role: UserRole) {
    setSelectedRole(role)
  }

  function handleDemoLogin() {
    const credentials = DEMO_CREDENTIALS[selectedRole]
    setValue("email", credentials.email, { shouldValidate: true })
    setValue("password", credentials.password, { shouldValidate: true })
    attemptLogin(
      credentials,
      `Demo ${selectedRole} account not found — seed the database first.`,
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
          Welcome back
        </h1>
        <p className="text-muted-foreground mt-1.5 text-sm">
          Sign in to your Veyra account to keep sourcing.
        </p>
      </motion.div>

      <motion.div
        variants={fieldVariants}
        transition={{ duration: 0.35 }}
        className="mt-7 flex flex-col gap-2"
      >
        <span className="text-muted-foreground text-xs font-medium">I'm signing in as a</span>
        <div className="grid grid-cols-2 gap-2.5" role="radiogroup" aria-label="Account type">
          {roleOptions.map(({ value, label, description, icon: Icon }) => {
            const active = selectedRole === value
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => handleSelectRole(value)}
                className={cn(
                  "relative flex flex-col items-start gap-2 rounded-xl border px-3.5 py-3 text-left transition-all",
                  active
                    ? "border-primary bg-primary/8 shadow-primary/10 shadow-sm"
                    : "border-border hover:border-foreground/25 hover:bg-accent/50",
                )}
              >
                <span
                  className={cn(
                    "flex size-8 items-center justify-center rounded-lg transition-colors",
                    active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                  )}
                >
                  <Icon className="size-4" />
                </span>
                <span>
                  <span
                    className={cn(
                      "block text-sm font-semibold transition-colors",
                      active ? "text-foreground" : "text-foreground/80",
                    )}
                  >
                    {label}
                  </span>
                  <span className="text-muted-foreground block text-xs">{description}</span>
                </span>
                {active && (
                  <motion.span
                    layoutId="role-active-ring"
                    className="border-primary pointer-events-none absolute inset-0 rounded-xl border-2"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
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

      <motion.div variants={fieldVariants} transition={{ duration: 0.35 }} className="mt-6">
        <Button
          type="button"
          variant="outline"
          size="lg"
          disabled={isSubmitting}
          onClick={handleDemoLogin}
          className="group w-full gap-2"
        >
          <Sparkles className="text-primary size-4" />
          {isSubmitting ? "Signing in..." : `Sign in as demo ${selectedRole}`}
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
