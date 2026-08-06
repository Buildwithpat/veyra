const required = (key: string, value: string | undefined) => {
  if (!value) throw new Error(`Missing required env var: ${key}`)
  return value
}

export const env = {
  apiUrl: required("VITE_API_URL", import.meta.env.VITE_API_URL),
  cloudinaryCloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ?? "",
}
