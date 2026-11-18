import { OnboardingWizard } from '@/features/onboarding/components/OnboardingWizard';

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-[#06202B] text-foreground flex flex-col justify-center">
      <OnboardingWizard />
    </div>
  );
}
