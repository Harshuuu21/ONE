import { OnboardingFlow } from '@/components/onboarding/onboarding-flow'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Onboarding | ONE',
  description: 'Welcome to ONE. Let us understand what matters most to you.',
}

export default function OnboardingPage() {
  return (
    <div className="grain min-h-[100svh] w-full overflow-hidden">
      <OnboardingFlow />
    </div>
  )
}
