const ACCESS_TOKEN_KEY = "veyra_access_token"

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY)

export const setAccessToken = (token: string) =>
  localStorage.setItem(ACCESS_TOKEN_KEY, token)

export const clearAuth = () => localStorage.removeItem(ACCESS_TOKEN_KEY)
