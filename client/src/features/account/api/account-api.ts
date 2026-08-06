import { apiClient } from "@/lib/api-client"
import type { User } from "@/features/auth/types"
import type { ChangePasswordInput, UpdateProfileInput } from "@/features/account/types"
import type { ApiSuccess } from "@/types/api"

export const accountApi = {
  async updateProfile(input: UpdateProfileInput) {
    const { data } = await apiClient.patch<ApiSuccess<User>>("/users/me", input)
    return data.data
  },

  async changePassword(input: ChangePasswordInput) {
    await apiClient.post<ApiSuccess<null>>("/users/me/password", input)
  },
}
