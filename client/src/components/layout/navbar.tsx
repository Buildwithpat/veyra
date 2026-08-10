import { useEffect, useState, type FormEvent } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Menu, Search } from "lucide-react"
import { motion, useMotionValueEvent, useScroll } from "framer-motion"

import { VeyraMark } from "@/components/shared/veyra-mark"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { CartDrawer } from "@/features/cart/components/cart-drawer"
import { cn } from "@/lib/utils"

interface NavLink {
  to: string
  label: string
  sectionId: string | null
}

const navLinks: NavLink[] = [
  { to: "/marketplace", label: "Marketplace", sectionId: null },
  { to: "/#how-it-works", label: "How it works", sectionId: "how-it-works" },
  { to: "/#faq", label: "FAQ", sectionId: "faq" },
]

/**
 * Scrollspy for in-page hash links, based on scroll position rather than
 * IntersectionObserver — an observer only fires when a tracked element's
 * intersection *changes*, so scrolling past both sections into unrelated
 * content below never fires a "nothing intersecting" event and the last
 * active section stays stuck highlighted. Checking position directly on
 * every scroll always reflects the current state, including "neither."
 */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    function update() {
      const referenceY = window.innerHeight * 0.35
      let current: string | null = null
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        if (rect.top <= referenceY && rect.bottom >= referenceY) {
          current = id
          break
        }
      }
      setActive(current)
    }

    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [ids])

  return active
}

function NavSearch({
  className = "hidden w-full max-w-xs lg:block",
  onNavigate,
}: {
  className?: string
  onNavigate?: () => void
}) {
  const navigate = useNavigate()
  const [value, setValue] = useState("")

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = value.trim()
    navigate(trimmed ? `/marketplace?q=${encodeURIComponent(trimmed)}` : "/marketplace")
    onNavigate?.()
  }

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type="search"
        placeholder="Search fabrics..."
        aria-label="Search fabrics"
        className="bg-background/60 h-9 rounded-full pl-8 text-sm"
      />
    </form>
  )
}

function AuthActions({ mobile = false }: { mobile?: boolean }) {
  const { isAuthenticated, user } = useAuth()
  const dashboardTo = user?.role === "supplier" ? "/supplier/dashboard" : "/dashboard"

  if (isAuthenticated) {
    const button = (
      <Button asChild size={mobile ? "default" : "sm"} className={mobile ? "w-full" : undefined}>
        <Link to={dashboardTo}>Dashboard</Link>
      </Button>
    )
    return mobile ? <SheetClose asChild>{button}</SheetClose> : button
  }

  const signIn = (
    <Button
      asChild
      variant="ghost"
      size={mobile ? "default" : "sm"}
      className={mobile ? "w-full" : undefined}
    >
      <Link to="/login">Sign in</Link>
    </Button>
  )
  const getStarted = (
    <Button
      asChild
      size={mobile ? "default" : "sm"}
      className={cn("shadow-primary/20 font-medium shadow-sm", mobile && "w-full")}
    >
      <Link to="/register">Get started</Link>
    </Button>
  )

  if (mobile) {
    return (
      <>
        <SheetClose asChild>{signIn}</SheetClose>
        <SheetClose asChild>{getStarted}</SheetClose>
      </>
    )
  }

  return (
    <>
      {signIn}
      {getStarted}
    </>
  )
}

export function Navbar() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 8))

  const activeSection = useActiveSection(["how-it-works", "faq"])

  function isActive(link: NavLink) {
    if (link.sectionId) return location.pathname === "/" && activeSection === link.sectionId
    return location.pathname === link.to
  }

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-4 pt-3 sm:px-6">
      <div
        className={cn(
          "mx-auto grid h-14 max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-4 rounded-2xl border px-4 backdrop-blur-xl transition-all duration-300 sm:px-5",
          scrolled
            ? "border-border/70 bg-card/90 shadow-[0_1px_2px_rgba(15,23,42,0.05),0_16px_32px_-12px_rgba(15,23,42,0.14)]"
            : "border-border/30 bg-card/55 shadow-[0_1px_2px_rgba(15,23,42,0.03)]",
        )}
      >
        <div className="flex items-center gap-6">
          <a href="/" className="flex items-center gap-2">
            <span className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-lg">
              <VeyraMark className="size-4" />
            </span>
            <span className="font-display text-base font-semibold tracking-tight">Veyra</span>
          </a>

          <nav className="hidden items-center gap-1 text-sm md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className={cn(
                  "relative rounded-full px-3.5 py-1.5 transition-colors",
                  isActive(link)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {isActive(link) && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="bg-accent absolute inset-0 -z-10 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <NavSearch />

        <div className="flex items-center gap-1 justify-self-end">
          <CartDrawer />
          <div className="hidden items-center gap-2 md:ml-3 md:flex">
            <AuthActions />
          </div>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="size-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Veyra</SheetTitle>
              </SheetHeader>
              <div className="px-6 pb-2">
                <NavSearch className="block w-full" onNavigate={() => setMobileOpen(false)} />
              </div>
              <nav className="flex flex-col gap-1 px-6">
                {navLinks.map((link) => (
                  <SheetClose key={link.label} asChild>
                    <Link
                      to={link.to}
                      className={cn(
                        "rounded-md px-2 py-2.5 text-sm transition-colors",
                        isActive(link)
                          ? "bg-accent text-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground",
                      )}
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-2 px-6 pb-6">
                <AuthActions mobile />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
