import { useState } from "react"
import { Link, Outlet, useLocation } from "react-router-dom"
import {
  FileText,
  Heart,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Menu,
  Package,
  ShoppingCart,
  User,
} from "lucide-react"

import { VeyraMark } from "@/components/shared/veyra-mark"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { AssistantTrigger } from "@/features/assistant/components/assistant-trigger"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { cn } from "@/lib/utils"

function VeyraWordmark() {
  return (
    <span className="flex items-center gap-2">
      <span className="bg-primary text-primary-foreground flex size-7 shrink-0 items-center justify-center rounded-lg">
        <VeyraMark className="size-4" />
      </span>
      <span className="text-lg font-semibold tracking-tight">Veyra</span>
    </span>
  )
}

const buyerLinks = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/orders", label: "Orders", icon: ShoppingCart },
  { to: "/dashboard/rfqs", label: "RFQs", icon: FileText },
  { to: "/dashboard/wishlist", label: "Wishlist", icon: Heart },
  { to: "/dashboard/messages", label: "Messages", icon: MessageSquare },
  { to: "/dashboard/profile", label: "Profile", icon: User },
]

const supplierLinks = [
  { to: "/supplier/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/supplier/inventory", label: "Inventory", icon: Package },
  { to: "/supplier/orders", label: "Orders", icon: ShoppingCart },
  { to: "/supplier/rfqs", label: "RFQs", icon: FileText },
  { to: "/supplier/messages", label: "Messages", icon: MessageSquare },
  { to: "/supplier/profile", label: "Profile", icon: User },
]

function DashboardNavLinks({
  links,
  location,
  onNavigate,
}: {
  links: typeof buyerLinks
  location: ReturnType<typeof useLocation>
  onNavigate?: () => void
}) {
  return (
    <nav className="flex flex-1 flex-col gap-1">
      {links.map(({ to, label, icon: Icon }) => {
        const active =
          to === "/dashboard" || to === "/supplier/dashboard"
            ? location.pathname === to
            : location.pathname.startsWith(to)

        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
              active
                ? "bg-accent text-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}

export function DashboardLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const links = user?.role === "supplier" ? supplierLinks : buyerLinks

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden md:flex-row">
      <header className="border-border/60 bg-surface flex shrink-0 items-center justify-between border-b px-4 py-3 md:hidden">
        <a href="/">
          <VeyraWordmark />
        </a>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="size-5" />
            <span className="sr-only">Open dashboard menu</span>
          </Button>
          <SheetContent side="left" className="flex w-64 flex-col px-4 py-6">
            <SheetHeader className="px-2">
              <SheetTitle>Veyra</SheetTitle>
            </SheetHeader>
            <DashboardNavLinks
              links={links}
              location={location}
              onNavigate={() => setMobileOpen(false)}
            />
            <Button variant="ghost" size="sm" className="justify-start gap-3" onClick={logout}>
              <LogOut className="size-4" />
              Sign out
            </Button>
          </SheetContent>
        </Sheet>
      </header>

      <aside className="border-border/60 bg-surface hidden w-64 min-h-0 shrink-0 flex-col overflow-y-auto border-r px-4 py-6 md:flex">
        <a href="/" className="mb-8 px-2">
          <VeyraWordmark />
        </a>

        <DashboardNavLinks links={links} location={location} />

        <Button
          variant="ghost"
          size="sm"
          className="justify-start gap-3"
          onClick={logout}
        >
          <LogOut className="size-4" />
          Sign out
        </Button>
      </aside>

      <main className="min-h-0 min-w-0 flex-1 overflow-y-auto p-5 md:p-8">
        <Outlet />
      </main>

      <AssistantTrigger />
    </div>
  )
}
