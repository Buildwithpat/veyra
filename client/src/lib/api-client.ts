import axios from "axios"

import { env } from "@/config/env"
import { getAccessToken, clearAuth } from "@/lib/auth-storage"

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  withCredentials: true,
})

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuth()
    }
    return Promise.reject(error)
  },
)
