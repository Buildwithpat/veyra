import { AppShell } from "@/components/shell/app-shell"
import { AuthProvider } from "@/providers/auth-provider"
import { QueryProvider } from "@/providers/query-provider"
import { CartProvider } from "@/features/cart/cart-provider"
import { Toaster } from "@/components/ui/sonner"
import { ErrorBoundary } from "@/components/shared/error-boundary"

function App() {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <AuthProvider>
          <CartProvider>
            <AppShell />
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </QueryProvider>
    </ErrorBoundary>
  )
}

export default App
