import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  server: {
    port: 5173,
  },
  build: {
    rolldownOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes("node_modules")) {
            if (/react-router|\/react\/|\/react-dom\//.test(id)) return "vendor-react"
            if (id.includes("@tanstack")) return "vendor-query"
            if (id.includes("framer-motion")) return "vendor-motion"
          }
        },
      },
    },
  },
})
