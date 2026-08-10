import { LegalPage } from "@/components/shared/legal-page"
import { useDocumentTitle } from "@/hooks/use-document-title"

export function TermsPage() {
  useDocumentTitle("Terms of Service")

  return (
    <LegalPage
      title="Terms of Service"
      updatedAt="August 10, 2026"
      intro="These terms govern your use of Veyra as a buyer or supplier. By creating an account, you agree to them."
      sections={[
        {
          heading: "The marketplace",
          body: "Veyra is a marketplace that connects fabric buyers with suppliers. Suppliers list fabrics with pricing, minimum order quantities, and specifications; buyers browse, compare, and place orders directly with suppliers. Veyra facilitates the connection, listing, and transaction record — the underlying sale of goods is between the buyer and the supplier.",
        },
        {
          heading: "Accounts",
          body: "You need an account to buy or sell on Veyra. You're responsible for keeping your login credentials secure and for the accuracy of the information in your profile — supplier listings in particular should reflect real inventory, pricing, and lead times.",
        },
        {
          heading: "Orders and sample requests",
          body: "Placing an order is a commitment to purchase at the listed price and quantity, subject to the supplier's confirmation and stated minimum order quantity. Sample requests are a lower-commitment way to evaluate a fabric before ordering in bulk. Suppliers are expected to respond to orders and sample requests in good faith and in a timely manner.",
        },
        {
          heading: "Messaging and the AI assistant",
          body: "Messages sent between buyers and suppliers — including messages sent on your behalf when you ask the AI assistant to contact a supplier — should be relevant to sourcing and business on the platform. The assistant is a tool to help you search, compare, and communicate faster; it isn't a substitute for verifying specifications or terms directly with a supplier before ordering.",
        },
        {
          heading: "Acceptable use",
          body: "Don't use Veyra to list counterfeit or misrepresented goods, to harass another user, or to attempt to circumvent the platform's fees or protections by taking a connection made here off-platform in bad faith. We may suspend accounts that violate these terms.",
        },
        {
          heading: "Disclaimers",
          body: "Veyra is provided \"as is.\" We work to keep listings, match scores, and supplier information accurate, but we don't guarantee the quality, availability, or fitness of any fabric listed by a third-party supplier.",
        },
        {
          heading: "Changes to these terms",
          body: "We may update these terms as the platform evolves. Continued use of Veyra after a change means you accept the updated terms.",
        },
        {
          heading: "Contact",
          body: "Questions about these terms can be sent to legal@veyra.example.",
        },
      ]}
    />
  )
}
