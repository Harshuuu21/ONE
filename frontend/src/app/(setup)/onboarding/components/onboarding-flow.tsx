'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { WelcomeScreen } from './screens/welcome-screen'
import { AboutYouScreen } from './screens/about-you-screen'
import { WhatMattersScreen } from './screens/what-matters-screen'
import { FinancialStyleScreen, type FinancialStyle } from './screens/financial-style-screen'
import { CommunitiesScreen } from './screens/communities-screen'
import { SummaryScreen } from './screens/summary-screen'

type OnboardingStep = 
  | 'welcome'
  | 'about'
  | 'matters'
  | 'style'
  | 'communities'
  | 'summary'

const STEPS: OnboardingStep[] = [
  'welcome',
  'about',
  'matters',
  'style',
  'communities',
  'summary'
]

export interface OnboardingData {
  role: string
  goals: string[]
  style: FinancialStyle
  communities: string[]
}

export function OnboardingFlow() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [data, setData] = useState<OnboardingData>({
    role: '',
    goals: [],
    style: { confidence: '', savings: '' },
    communities: []
  })

  const currentStep = STEPS[currentStepIndex]

  const nextStep = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex(i => i + 1)
    }
  }

  const renderScreen = () => {
    switch (currentStep) {
      case 'welcome':
        return <WelcomeScreen onNext={nextStep} />
      case 'about':
        return (
          <AboutYouScreen 
            onSelect={(role) => {
              setData(prev => ({ ...prev, role }))
              nextStep()
            }} 
          />
        )
      case 'matters':
        return (
          <WhatMattersScreen 
            onNext={(goals) => {
              setData(prev => ({ ...prev, goals }))
              nextStep()
            }} 
          />
        )
      case 'style':
        return (
          <FinancialStyleScreen 
            onNext={(style) => {
              setData(prev => ({ ...prev, style }))
              nextStep()
            }} 
          />
        )
      case 'communities':
        return (
          <CommunitiesScreen 
            onNext={(communities) => {
              setData(prev => ({ ...prev, communities }))
              nextStep()
            }} 
          />
        )
      case 'summary':
        return <SummaryScreen data={data} />
      default:
        return null
    }
  }

  return (
    <div className="relative flex h-[100svh] w-full flex-col bg-background px-6">
      <main className="mx-auto flex w-full max-w-4xl flex-1 items-center justify-center py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, ease: [0.21, 0.6, 0.35, 1] }}
            className="w-full h-full"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Progress indicator (optional, maybe too traditional? Keep it subtle if present) */}
      {currentStepIndex > 0 && currentStepIndex < STEPS.length - 1 && (
        <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 gap-2">
          {STEPS.slice(1, STEPS.length - 1).map((step, i) => (
            <div
              key={step}
              className={`h-1.5 w-1.5 rounded-full transition-all duration-500 ${
                i + 1 === currentStepIndex
                  ? 'bg-foreground scale-100'
                  : i + 1 < currentStepIndex
                  ? 'bg-muted-foreground scale-90'
                  : 'bg-border scale-90'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
