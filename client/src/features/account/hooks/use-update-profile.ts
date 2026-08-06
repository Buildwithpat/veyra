import { useMutation, useQueryClient } from "@tanstack/react-query"

import { accountApi } from "@/features/account/api/account-api"

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: accountApi.updateProfile,
    onSuccess: (user) => {
      queryClient.setQueryData(["auth", "me"], user)
    },
  })
}
