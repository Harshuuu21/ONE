import { LandingNav } from '@/components/landing/landing-nav'
import { LandingHero } from '@/components/landing/landing-hero'
import { BeliefSection } from '@/components/landing/belief-section'
import { AiCharacterSection } from '@/components/landing/ai-character-section'
import { PillarsSection } from '@/components/landing/pillars-section'
import { LandingCta } from '@/components/landing/landing-cta'

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
