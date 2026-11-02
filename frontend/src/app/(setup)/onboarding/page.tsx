import { OnboardingFlow } from './components/onboarding-flow'

export default function OnboardingPage() {
  return (
    <div className="grain min-h-[100svh] bg-background">
      <div className="mx-auto max-w-xl px-5 py-12">
        <OnboardingFlow />
      </div>
    </div>
  )
}
