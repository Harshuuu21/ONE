'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { OneOrb } from '@/components/one-mark'
import type { FinancialStyle } from './financial-style-screen'

interface OnboardingData {
  role: string
  goals: string[]
  style: FinancialStyle
  communities: string[]
}

interface SummaryScreenProps {
  data: OnboardingData
}

export function SummaryScreen({ data }: SummaryScreenProps) {
  const router = useRouter()
  const [isTyping, setIsTyping] = useState(true)

  // A very simple dynamic summary based on the data
  const mainGoal = data.goals.length > 0 ? data.goals[0].toLowerCase() : 'your future'
  const confidenceLevel = data.style.confidence ? data.style.confidence.toLowerCase() : 'building'
  
  const summaryText = `You are a ${data.role.toLowerCase()} focused on ${mainGoal}, with a ${confidenceLevel} approach to money. I will help you stay on track, discover opportunities, and connect with people pursuing similar goals.`

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(false)
    }, 2500) // Simulated AI generation time
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="mb-8"
      >
        <OneOrb size={80} />
      </motion.div>
      
      <div className="mx-auto max-w-2xl px-4">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="font-serif text-2xl font-medium leading-relaxed tracking-tight sm:text-3xl"
        >
          {summaryText}
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.5 }}
        className="mt-16"
      >
        <button
          onClick={() => {
            // In a real app, we'd save this to a backend or context.
            // For this simulated experience, we'll store a flag in localStorage.
            localStorage.setItem('one_onboarding_complete', 'true')
            router.push('/setup')
          }}
          className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03] active:scale-95"
        >
          Continue Setup
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </button>
      </motion.div>
    </div>
  )
}
