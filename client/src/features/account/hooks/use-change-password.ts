import { useMutation } from "@tanstack/react-query"

import { accountApi } from "@/features/account/api/account-api"

export function useChangePassword() {
  return useMutation({
    mutationFn: accountApi.changePassword,
  })
}
