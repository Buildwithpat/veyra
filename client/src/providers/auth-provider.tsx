import { useCallback, useMemo, type ReactNode } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { authApi } from "@/features/auth/api/auth-api"
import { clearAuth, getAccessToken, setAccessToken } from "@/lib/auth-storage"
import { AuthContext, type AuthContextValue } from "@/providers/auth-context"

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()

  const { data: user, isLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: authApi.me,
    enabled: Boolean(getAccessToken()),
    retry: false,
    staleTime: 5 * 60 * 1000,
  })

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: ({ user: loggedInUser, accessToken }) => {
      setAccessToken(accessToken)
      queryClient.setQueryData(["auth", "me"], loggedInUser)
    },
  })

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: ({ user: registeredUser, accessToken }) => {
      setAccessToken(accessToken)
      queryClient.setQueryData(["auth", "me"], registeredUser)
    },
  })

  const logout = useCallback(async () => {
    await authApi.logout().catch(() => {})
    clearAuth()
    queryClient.setQueryData(["auth", "me"], null)
    queryClient.clear()
  }, [queryClient])

  const value = useMemo<AuthContextValue>(
    () => ({
      user: user ?? null,
      isLoading,
      isAuthenticated: Boolean(user),
      login: async (input) => {
        const data = await loginMutation.mutateAsync(input)
        return data.user
      },
      register: async (input) => {
        const data = await registerMutation.mutateAsync(input)
        return data.user
      },
      logout,
    }),
    [user, isLoading, loginMutation, registerMutation, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
