import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { registerSchema, type RegisterFormValues } from "@/features/auth/schemas"
import { useDocumentTitle } from "@/hooks/use-document-title"
import { cn } from "@/lib/utils"

const roles = [
  { value: "buyer", label: "Buyer" },
  { value: "supplier", label: "Supplier" },
] as const

const fieldVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
}

export function RegisterPage() {
  useDocumentTitle("Create Account")
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "buyer" },
  })

  const selectedRole = watch("role")

  const onSubmit = async (values: RegisterFormValues) => {
    setIsSubmitting(true)
    try {
      await registerUser(values)
      navigate(values.role === "buyer" ? "/onboarding" : "/supplier/onboarding", {
        replace: true,
      })
    } catch {
      toast.error("Could not create your account. Try again.")
    } finally {
      setIsSubmitting(false)
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
          Create your account
        </h1>
        <p className="text-muted-foreground mt-1.5 text-sm">
          Join Veyra as a buyer or supplier.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4">
        <motion.div variants={fieldVariants} transition={{ duration: 0.35 }} className="grid grid-cols-2 gap-2">
          {roles.map((role) => (
            <button
              key={role.value}
              type="button"
              onClick={() => setValue("role", role.value, { shouldValidate: true })}
              className={cn(
                "rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                selectedRole === role.value
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-input text-muted-foreground hover:bg-accent",
              )}
            >
              {role.label}
            </button>
          ))}
        </motion.div>

        <motion.div variants={fieldVariants} transition={{ duration: 0.35 }} className="flex flex-col gap-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" autoComplete="name" className="h-10" {...register("name")} />
          {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
        </motion.div>

        <motion.div variants={fieldVariants} transition={{ duration: 0.35 }} className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            className="h-10"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-destructive text-xs">{errors.email.message}</p>
          )}
        </motion.div>

        <motion.div variants={fieldVariants} transition={{ duration: 0.35 }} className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            className="h-10"
            {...register("password")}
          />
          {errors.password ? (
            <p className="text-destructive text-xs">{errors.password.message}</p>
          ) : (
            <p className="text-muted-foreground text-xs">
              At least 8 characters, with uppercase, lowercase, a number, and a symbol.
            </p>
          )}
        </motion.div>

        <motion.div variants={fieldVariants} transition={{ duration: 0.35 }}>
          <Button
            type="submit"
            disabled={isSubmitting}
            size="lg"
            className="group shadow-primary/25 mt-2 w-full gap-2 shadow-lg"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
            {!isSubmitting && (
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            )}
          </Button>
        </motion.div>
      </form>

      <motion.p
        variants={fieldVariants}
        transition={{ duration: 0.35 }}
        className="text-muted-foreground mt-8 text-center text-sm"
      >
        Already have an account?{" "}
        <Link to="/login" className="text-foreground underline-offset-4 hover:underline">
          Sign in
        </Link>
      </motion.p>
    </motion.div>
  )
}
