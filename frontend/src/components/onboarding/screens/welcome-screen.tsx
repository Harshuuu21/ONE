'use client'

import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { OneOrb } from '@/components/one-mark'

interface WelcomeScreenProps {
  onNext: () => void
}

export function WelcomeScreen({ onNext }: WelcomeScreenProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="mb-8"
      >
        <OneOrb size={80} />
      </motion.div>
      
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        className="font-serif text-3xl font-medium tracking-tight text-balance sm:text-4xl md:text-5xl"
      >
        Before we begin, I'd like to understand what matters most to you.
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="mt-12"
      >
        <button
          onClick={onNext}
          className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03] active:scale-95"
        >
          Let's Begin
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </button>
      </motion.div>
    </div>
  )
}
