import { LegalPage } from "@/components/shared/legal-page"
import { useDocumentTitle } from "@/hooks/use-document-title"

export function PrivacyPage() {
  useDocumentTitle("Privacy Policy")

  return (
    <LegalPage
      title="Privacy Policy"
      updatedAt="August 10, 2026"
      intro="This policy explains what information Veyra collects when you use the marketplace, how it's used, and the choices you have. It applies to buyers and suppliers alike."
      sections={[
        {
          heading: "Information we collect",
          body: (
            <ul className="flex flex-col gap-1.5">
              <li>
                <strong className="text-foreground">Account details</strong> — name, email,
                password (stored hashed, never in plain text), and role (buyer or supplier).
              </li>
              <li>
                <strong className="text-foreground">Business profile</strong> — for suppliers:
                business name, location, certifications, and other onboarding details you
                provide.
              </li>
              <li>
                <strong className="text-foreground">Marketplace activity</strong> — orders,
                shipping addresses, wishlist items, sample requests, and messages sent between
                buyers and suppliers.
              </li>
              <li>
                <strong className="text-foreground">Assistant conversations</strong> — messages
                you send to the Veyra AI assistant, used to generate a response and, where you
                ask it to, to carry out an action on your behalf (e.g. sending a message to a
                supplier).
              </li>
            </ul>
          ),
        },
        {
          heading: "How we use it",
          body: "We use this information to operate the marketplace: creating your account, processing and tracking orders, connecting buyers with suppliers, powering search and the AI assistant, and keeping the platform secure. We don't sell your personal information.",
        },
        {
          heading: "Sharing between buyers and suppliers",
          body: "Placing an order, requesting a sample, or sending a message necessarily shares some information with the other party — for example, a supplier sees the shipping address and order details for orders containing their products, and a buyer sees a supplier's public business profile. We don't share your information with unrelated third parties beyond what's needed to run the service (e.g. our hosting and database providers).",
        },
        {
          heading: "Cookies and local storage",
          body: "Veyra stores your login session in your browser's local storage so you stay signed in between visits. We don't use third-party advertising trackers.",
        },
        {
          heading: "Data retention",
          body: "We keep your account and marketplace activity for as long as your account is active, so order history, messages, and past sample requests remain available to you. You can request deletion of your account at any time by contacting us.",
        },
        {
          heading: "Your choices",
          body: "You can update your profile information from your dashboard at any time, and can request a copy or deletion of your data by reaching out using the contact details below.",
        },
        {
          heading: "Contact",
          body: "Questions about this policy can be sent to privacy@veyra.example.",
        },
      ]}
    />
  )
}
