import type { ReactNode } from "react"

interface LegalSection {
  heading: string
  body: ReactNode
}

export function LegalPage({
  title,
  updatedAt,
  intro,
  sections,
}: {
  title: string
  updatedAt: string
  intro: string
  sections: LegalSection[]
}) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-muted-foreground text-sm">Last updated {updatedAt}</p>
      <h1 className="font-display text-foreground mt-2 text-3xl font-semibold tracking-tight">
        {title}
      </h1>
      <p className="text-muted-foreground mt-4 text-sm leading-relaxed">{intro}</p>

      <div className="mt-10 flex flex-col gap-8">
        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-foreground text-lg font-semibold">{section.heading}</h2>
            <div className="text-muted-foreground mt-2 text-sm leading-relaxed">
              {section.body}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
