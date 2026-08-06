import { Navigate, Outlet } from "react-router-dom"

import { useAuth } from "@/features/auth/hooks/use-auth"

export function RequireOnboarding() {
  const { user } = useAuth()

  if (user && !user.onboardingCompleted) {
    const target = user.role === "supplier" ? "/supplier/onboarding" : "/onboarding"
    return <Navigate to={target} replace />
  }

  return <Outlet />
}
