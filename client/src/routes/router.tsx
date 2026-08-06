import { lazy, Suspense } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"

import { PublicLayout } from "@/components/layout/public-layout"
import { AuthLayout } from "@/components/layout/auth-layout"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { RootProviders } from "@/components/layout/root-providers"
import { ProtectedRoute } from "@/components/shared/protected-route"
import { RequireOnboarding } from "@/components/shared/require-onboarding"
import { LandingPage } from "@/pages/landing-page"
import { NotFoundPage } from "@/pages/not-found-page"

const LoginPage = lazy(() =>
  import("@/pages/login-page").then((m) => ({ default: m.LoginPage })),
)
const RegisterPage = lazy(() =>
  import("@/pages/register-page").then((m) => ({ default: m.RegisterPage })),
)
const ForgotPasswordPage = lazy(() =>
  import("@/pages/forgot-password-page").then((m) => ({ default: m.ForgotPasswordPage })),
)
const ResetPasswordPage = lazy(() =>
  import("@/pages/reset-password-page").then((m) => ({ default: m.ResetPasswordPage })),
)
const DashboardPage = lazy(() =>
  import("@/pages/dashboard-page").then((m) => ({ default: m.DashboardPage })),
)
const DashboardProfilePage = lazy(() =>
  import("@/pages/dashboard-profile-page").then((m) => ({
    default: m.DashboardProfilePage,
  })),
)
const DashboardOrdersPage = lazy(() =>
  import("@/pages/dashboard-orders-page").then((m) => ({
    default: m.DashboardOrdersPage,
  })),
)
const DashboardOrderDetailPage = lazy(() =>
  import("@/pages/dashboard-order-detail-page").then((m) => ({
    default: m.DashboardOrderDetailPage,
  })),
)
const OnboardingPage = lazy(() =>
  import("@/pages/onboarding-page").then((m) => ({ default: m.OnboardingPage })),
)
const MarketplacePage = lazy(() =>
  import("@/pages/marketplace-page").then((m) => ({ default: m.MarketplacePage })),
)
const ProductDetailsPage = lazy(() =>
  import("@/pages/product-details-page").then((m) => ({ default: m.ProductDetailsPage })),
)
const CartPage = lazy(() =>
  import("@/pages/cart-page").then((m) => ({ default: m.CartPage })),
)
const CheckoutPage = lazy(() =>
  import("@/pages/checkout-page").then((m) => ({ default: m.CheckoutPage })),
)
const SupplierOnboardingPage = lazy(() =>
  import("@/pages/supplier-onboarding-page").then((m) => ({
    default: m.SupplierOnboardingPage,
  })),
)
const SupplierDashboardPage = lazy(() =>
  import("@/pages/supplier-dashboard-page").then((m) => ({
    default: m.SupplierDashboardPage,
  })),
)
const SupplierProfilePage = lazy(() =>
  import("@/pages/supplier-profile-page").then((m) => ({
    default: m.SupplierProfilePage,
  })),
)
const SupplierInventoryPage = lazy(() =>
  import("@/pages/supplier-inventory-page").then((m) => ({
    default: m.SupplierInventoryPage,
  })),
)
const SupplierProductFormPage = lazy(() =>
  import("@/pages/supplier-product-form-page").then((m) => ({
    default: m.SupplierProductFormPage,
  })),
)
const SupplierOrdersPage = lazy(() =>
  import("@/pages/supplier-orders-page").then((m) => ({ default: m.SupplierOrdersPage })),
)
const SupplierOrderDetailPage = lazy(() =>
  import("@/pages/supplier-order-detail-page").then((m) => ({
    default: m.SupplierOrderDetailPage,
  })),
)

function withSuspense(element: React.ReactNode) {
  return <Suspense fallback={null}>{element}</Suspense>
}

const router = createBrowserRouter([
  {
    element: <RootProviders />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { index: true, element: <LandingPage /> },
          { path: "marketplace", element: withSuspense(<MarketplacePage />) },
          { path: "products/:slug", element: withSuspense(<ProductDetailsPage />) },
          { path: "cart", element: withSuspense(<CartPage />) },
        ],
      },
      {
        element: <AuthLayout />,
        children: [
          { path: "login", element: withSuspense(<LoginPage />) },
          { path: "register", element: withSuspense(<RegisterPage />) },
          { path: "forgot-password", element: withSuspense(<ForgotPasswordPage />) },
          { path: "reset-password", element: withSuspense(<ResetPasswordPage />) },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={["buyer"]} />,
        children: [
      {
        element: <PublicLayout />,
        children: [{ path: "onboarding", element: withSuspense(<OnboardingPage />) }],
      },
      {
        element: <RequireOnboarding />,
        children: [
          {
            element: <PublicLayout />,
            children: [{ path: "checkout", element: withSuspense(<CheckoutPage />) }],
          },
          {
            element: <DashboardLayout />,
            children: [
              { path: "dashboard", element: withSuspense(<DashboardPage />) },
              {
                path: "dashboard/profile",
                element: withSuspense(<DashboardProfilePage />),
              },
              {
                path: "dashboard/orders",
                element: withSuspense(<DashboardOrdersPage />),
              },
              {
                path: "dashboard/orders/:id",
                element: withSuspense(<DashboardOrderDetailPage />),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={["supplier"]} />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          {
            path: "supplier/onboarding",
            element: withSuspense(<SupplierOnboardingPage />),
          },
        ],
      },
      {
        element: <RequireOnboarding />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              {
                path: "supplier/dashboard",
                element: withSuspense(<SupplierDashboardPage />),
              },
              {
                path: "supplier/profile",
                element: withSuspense(<SupplierProfilePage />),
              },
              {
                path: "supplier/inventory",
                element: withSuspense(<SupplierInventoryPage />),
              },
              {
                path: "supplier/inventory/new",
                element: withSuspense(<SupplierProductFormPage />),
              },
              {
                path: "supplier/inventory/:id/edit",
                element: withSuspense(<SupplierProductFormPage />),
              },
              { path: "supplier/orders", element: withSuspense(<SupplierOrdersPage />) },
              {
                path: "supplier/orders/:id",
                element: withSuspense(<SupplierOrderDetailPage />),
              },
            ],
          },
        ],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
