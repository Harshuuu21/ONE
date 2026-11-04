'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useRouter } from 'next/navigation'

import { WelcomeScreen } from './screens/1-welcome'
import { WhyDataScreen } from './screens/2-why-data'
import { BasicProfileScreen } from './screens/3-basic-profile'
import { IdentityVerificationScreen } from './screens/4-identity-verification'
import { ConnectBankScreen } from './screens/5-connect-bank'
import { FinancialPermissionsScreen } from './screens/6-financial-permissions'
import { DevicePermissionsScreen } from './screens/7-device-permissions'
import { CommunityLendingScreen } from './screens/8-community-lending'
import { RepaymentAuthScreen } from './screens/9-repayment-auth'
import { PrivacyControlsScreen } from './screens/10-privacy-controls'
import { AiConsentScreen } from './screens/11-ai-consent'
import { SetupCompleteScreen } from './screens/12-setup-complete'
import { PasskeyRegistration } from '@/features/authentication/components/PasskeyRegistration'
import { PasskeyApi } from '@/features/authentication/services/passkeyApi'

type SetupStep =
  | 'welcome'
  | 'why-data'
  | 'basic-profile'
  | 'identity'
  | 'connect-bank'
  | 'financial-permissions'
  | 'device-permissions'
  | 'community-lending'
  | 'repayment-auth'
  | 'privacy-controls'
  | 'ai-consent'
  | 'setup-complete'
  | 'passkey'

const STEPS: SetupStep[] = [
  'welcome',
  'why-data',
  'basic-profile',
  'identity',
  'connect-bank',
  'financial-permissions',
  'device-permissions',
  'community-lending',
  'repayment-auth',
  'privacy-controls',
  'ai-consent',
  'setup-complete',
  'passkey',
]

export function SetupFlow() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const router = useRouter()

  const currentStep = STEPS[currentStepIndex]

  const nextStep = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex((i) => i + 1)
    } else {
      router.push('/dashboard')
    }
  }

  const renderScreen = () => {
    switch (currentStep) {
      case 'welcome':
        return <WelcomeScreen onNext={nextStep} />
      case 'why-data':
        return <WhyDataScreen onNext={nextStep} />
      case 'basic-profile':
        return <BasicProfileScreen onNext={nextStep} />
      case 'identity':
        return <IdentityVerificationScreen onNext={nextStep} />
      case 'connect-bank':
        return <ConnectBankScreen onNext={nextStep} />
      case 'financial-permissions':
        return <FinancialPermissionsScreen onNext={nextStep} />
      case 'device-permissions':
        return <DevicePermissionsScreen onNext={nextStep} />
      case 'community-lending':
        return <CommunityLendingScreen onNext={nextStep} />
      case 'repayment-auth':
        return <RepaymentAuthScreen onNext={nextStep} />
      case 'privacy-controls':
        return <PrivacyControlsScreen onNext={nextStep} />
      case 'ai-consent':
        return <AiConsentScreen onNext={nextStep} />
      case 'setup-complete':
        return <SetupCompleteScreen onNext={nextStep} />
      case 'passkey':
        return (
          <PasskeyRegistration
            onRegister={async (deviceName) => {
              try {
                await PasskeyApi.registerPasskey(deviceName);
              } catch (e) {
                console.warn('Passkey registration skipped or failed:', e);
              }
              router.push('/dashboard');
            }}
            onSkip={() => router.push('/dashboard')}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="relative flex h-[100svh] w-full flex-col bg-background px-6">
      <main className="mx-auto flex w-full max-w-2xl flex-1 items-center justify-center py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, ease: [0.21, 0.6, 0.35, 1] }}
            className="w-full"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Progress Indicator */}
      <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 gap-2">
        {STEPS.map((step, i) => (
          <div
            key={step}
            className={`h-1.5 w-1.5 rounded-full transition-all duration-500 ${
              i === currentStepIndex
                ? 'bg-foreground scale-100'
                : i < currentStepIndex
                ? 'bg-muted-foreground scale-90'
                : 'bg-border scale-90'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
