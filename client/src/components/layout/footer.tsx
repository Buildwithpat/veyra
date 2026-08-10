import { type FormEvent, useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"

import { VeyraMark } from "@/components/shared/veyra-mark"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const columns = [
  {
    heading: "Product",
    links: [
      { to: "/marketplace", label: "Browse marketplace" },
      { to: "/login", label: "Sign in" },
      { to: "/register", label: "Create account" },
    ],
  },
  {
    heading: "For suppliers",
    links: [
      { to: "/supplier/onboarding", label: "List your fabrics" },
      { to: "/login", label: "Supplier sign in" },
    ],
  },
  {
    heading: "Company",
    links: [
      { to: "/#how-it-works", label: "How it works" },
      { to: "/#why-veyra", label: "Why Veyra" },
      { to: "/#faq", label: "FAQ" },
    ],
  },
]

const socialLinks = [
  { short: "X", label: "X (Twitter)" },
  { short: "in", label: "LinkedIn" },
  { short: "IG", label: "Instagram" },
]

function deferred(feature: string) {
  toast.info(`${feature} is coming in a later phase.`)
}

function NewsletterForm() {
  const [email, setEmail] = useState("")

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setEmail("")
    deferred("Newsletter signup")
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 flex gap-2">
      <Input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
        aria-label="Email address"
        className="bg-card h-10 text-sm"
      />
      <Button type="submit" size="sm" className="shrink-0">
        Subscribe
      </Button>
    </form>
  )
}

export function Footer() {
  return (
    <footer className="bg-footer text-footer-foreground relative overflow-hidden">
      <p
        className="font-display pointer-events-none absolute -bottom-10 left-1/2 w-full -translate-x-1/2 text-center text-[13rem] leading-none font-semibold opacity-[0.04] select-none sm:text-[16rem]"
        aria-hidden
      >
        Veyra
      </p>

      <div className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))]">
          <div className="max-w-sm">
            <Link to="/" className="flex items-center gap-2">
              <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg">
                <VeyraMark className="size-4.5" />
              </span>
              <span className="font-display text-xl font-semibold tracking-tight">Veyra</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed opacity-70">
              A B2B marketplace connecting fabric buyers and suppliers worldwide — search, compare
              and order fabric in one place.
            </p>

            <div>
              <p className="mt-7 text-xs font-medium opacity-70">Get sourcing updates</p>
              <NewsletterForm />
            </div>

            <div className="mt-6 flex items-center gap-2">
              {socialLinks.map(({ short, label }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => deferred(`${label} presence`)}
                  aria-label={label}
                  className="border-footer-foreground/15 hover:border-footer-foreground/30 flex size-9 items-center justify-center rounded-full border text-xs font-medium transition-colors hover:opacity-100"
                  style={{ opacity: 0.7 }}
                >
                  {short}
                </button>
              ))}
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.heading}>
              <h3 className="text-sm font-medium">{column.heading}</h3>
              <ul className="mt-5 flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={`${column.heading}-${link.label}`}>
                    <Link to={link.to} className="text-sm opacity-70 transition-opacity hover:opacity-100">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-footer-foreground/10 mt-16 flex flex-col items-center gap-4 border-t pt-8 text-sm sm:flex-row sm:justify-between">
          <p className="opacity-70">&copy; {new Date().getFullYear()} Veyra. Modern Textile Commerce.</p>
          <div className="flex items-center gap-5 text-xs">
            <Link to="/privacy" className="opacity-70 transition-opacity hover:opacity-100">
              Privacy
            </Link>
            <Link to="/terms" className="opacity-70 transition-opacity hover:opacity-100">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
