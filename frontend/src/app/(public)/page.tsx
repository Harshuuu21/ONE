import { LandingNav } from '@/features/landing/components/landing-nav'
import { LandingHero } from '@/features/landing/components/landing-hero'
import { BeliefSection } from '@/features/landing/components/belief-section'
import { AiCharacterSection } from '@/features/landing/components/ai-character-section'
import { PillarsSection } from '@/features/landing/components/pillars-section'
import { LandingCta } from '@/features/landing/components/landing-cta'

export default function Page() {
  return (
    <main className="grain relative overflow-hidden">
      <LandingNav />
      <LandingHero />
      <BeliefSection />
      <AiCharacterSection />
      <PillarsSection />
      <LandingCta />
    </main>
  )
}
