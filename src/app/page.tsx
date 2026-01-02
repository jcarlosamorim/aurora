import {
  AuroraBackground,
  FloatingParticles,
  ParallaxSection,
  Hero,
  ForWhoSection,
  HowItWorks,
  ChatSimulation,
  MethodologySection,
  LayersPreview,
  GuaranteeSection,
  FinalCTA,
  Footer,
} from '@/components/landing';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] relative overflow-x-hidden">
      {/* Magical background effects */}
      <AuroraBackground />
      <FloatingParticles />

      {/* Page content with parallax */}
      <div className="relative z-10">
        <Hero />

        <ParallaxSection speed={0.2}>
          <ForWhoSection />
        </ParallaxSection>

        <ParallaxSection speed={0.15} direction="down">
          <HowItWorks />
        </ParallaxSection>

        <ChatSimulation />

        <ParallaxSection speed={0.1}>
          <MethodologySection />
        </ParallaxSection>

        <ParallaxSection speed={0.2} direction="down">
          <LayersPreview />
        </ParallaxSection>

        <ParallaxSection speed={0.15}>
          <GuaranteeSection />
        </ParallaxSection>

        <FinalCTA />
        <Footer />
      </div>
    </main>
  );
}
