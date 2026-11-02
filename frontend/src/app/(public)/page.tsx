import { LandingNav } from './components/landing-nav'
import { LandingHero } from './components/landing-hero'
import { BeliefSection } from './components/belief-section'
import { AiCharacterSection } from './components/ai-character-section'
import { PillarsSection } from './components/pillars-section'
import { LandingCta } from './components/landing-cta'

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
