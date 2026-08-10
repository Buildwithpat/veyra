export interface Faq {
  id: string
  question: string
  answer: string
}

export const faqs: Faq[] = [
  {
    id: "faq-01",
    question: "Who is Veyra built for?",
    answer:
      "Veyra connects two sides of the textile trade: buyers, such as garment manufacturers, fashion brands, boutique owners and retailers, and suppliers, including fabric mills, wholesalers and distributors looking to reach verified buyers.",
  },
  {
    id: "faq-02",
    question: "How does supplier verification work?",
    answer:
      "Every supplier profile displays certifications, years in business, and response times, and verified suppliers are marked directly on their listings so buyers can source with confidence before reaching out.",
  },
  {
    id: "faq-03",
    question: "What does the AI assistant actually do?",
    answer:
      "It helps with discovery: surfacing fabrics that match your brief, comparing similar options, and explaining technical specs in plain language. It's built to speed up sourcing decisions, not to replace the marketplace itself.",
  },
  {
    id: "faq-04",
    question: "Is there a minimum order quantity across the marketplace?",
    answer:
      "MOQ is set per supplier and per fabric, and shown clearly on every product page. It typically ranges from 80 to 400 meters depending on the fabric and mill.",
  },
  {
    id: "faq-05",
    question: "Can I request samples before committing to an order?",
    answer:
      "Not yet. Direct supplier messaging and sample requests are on our roadmap. Today you can review full specs, MOQ and supplier details on every listing before ordering.",
  },
]
