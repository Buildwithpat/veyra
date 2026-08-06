import { apiClient } from "@/lib/api-client"
import type { ApiSuccess } from "@/types/api"
import type {
  AuthResponse,
  ForgotPasswordInput,
  ForgotPasswordResponse,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  User,
} from "@/features/auth/types"

export const authApi = {
  async login(input: LoginInput) {
    const { data } = await apiClient.post<ApiSuccess<AuthResponse>>("/auth/login", input)
    return data.data
  },

  async register(input: RegisterInput) {
    const { data } = await apiClient.post<ApiSuccess<AuthResponse>>(
      "/auth/register",
      input,
    )
    return data.data
  },

  async logout() {
    await apiClient.post("/auth/logout")
  },

  async me() {
    const { data } = await apiClient.get<ApiSuccess<User>>("/auth/me")
    return data.data
  },

  async forgotPassword(input: ForgotPasswordInput) {
    const { data } = await apiClient.post<ApiSuccess<ForgotPasswordResponse | null>>(
      "/auth/forgot-password",
      input,
    )
    return data.data
  },

  async resetPassword(input: ResetPasswordInput) {
    await apiClient.post<ApiSuccess<null>>("/auth/reset-password", input)
  },
}
