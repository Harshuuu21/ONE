'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'

const confidenceOptions = ['Beginner', 'Learning', 'Confident', 'Expert']
const savingsOptions = ['Rarely', 'Sometimes', 'Regularly', 'Automated']

export type FinancialStyle = {
  confidence: string
  savings: string
}

interface FinancialStyleScreenProps {
  onNext: (style: FinancialStyle) => void
}

export function FinancialStyleScreen({ onNext }: FinancialStyleScreenProps) {
  const [style, setStyle] = useState<FinancialStyle>({ confidence: '', savings: '' })

  const isComplete = style.confidence && style.savings

  return (
    <div className="flex h-full flex-col justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="font-serif text-3xl font-medium tracking-tight sm:text-4xl">Your financial style</h2>
        <p className="mt-3 text-muted-foreground">Help me understand your relationship with money.</p>
      </motion.div>

      <div className="mx-auto mt-12 w-full max-w-xl space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="space-y-4"
        >
          <h3 className="text-sm font-medium text-muted-foreground">How confident are you with money?</h3>
          <div className="flex flex-wrap gap-2">
            {confidenceOptions.map(opt => (
              <button
                key={opt}
                onClick={() => setStyle(s => ({ ...s, confidence: opt }))}
                className={`rounded-full border px-4 py-2 text-sm transition-all ${
                  style.confidence === opt
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card/50 text-muted-foreground hover:border-primary/50 hover:text-foreground'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="space-y-4"
        >
          <h3 className="text-sm font-medium text-muted-foreground">How often do you save?</h3>
          <div className="flex flex-wrap gap-2">
            {savingsOptions.map(opt => (
              <button
                key={opt}
                onClick={() => setStyle(s => ({ ...s, savings: opt }))}
                className={`rounded-full border px-4 py-2 text-sm transition-all ${
                  style.savings === opt
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card/50 text-muted-foreground hover:border-primary/50 hover:text-foreground'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-12 flex justify-center"
      >
        <button
          onClick={() => onNext(style)}
          disabled={!isComplete}
          className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform hover:scale-[1.03] active:scale-95 disabled:pointer-events-none disabled:opacity-50"
        >
          Continue
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </button>
      </motion.div>
    </div>
  )
}
