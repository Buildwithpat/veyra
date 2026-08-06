import { AiSourcingDemoSection } from "@/components/landing/ai-sourcing-demo-section"
import { CtaSection } from "@/components/landing/cta-section"
import { FabricLibrarySection } from "@/components/landing/fabric-library-section"
import { FaqSection } from "@/components/landing/faq-section"
import { GlobalSourcingMapSection } from "@/components/landing/global-sourcing-map-section"
import { HeroSection } from "@/components/landing/hero-section"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { MarketplacePreviewSection } from "@/components/landing/marketplace-preview-section"
import { WhyChooseVeyraSection } from "@/components/landing/why-choose-veyra-section"

export function LandingPage() {
  return (
    <>
      <HeroSection />
      <FabricLibrarySection />
      <MarketplacePreviewSection />
      <AiSourcingDemoSection />
      <HowItWorksSection />
      <GlobalSourcingMapSection />
      <WhyChooseVeyraSection />
      <FaqSection />
      <CtaSection />
    </>
  )
}
