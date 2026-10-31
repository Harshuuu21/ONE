'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { ArrowRight, Check } from 'lucide-react'

const goals = [
  'Travel',
  'Laptop',
  'Emergency Fund',
  'Business',
  'House',
  'Investment',
  'Education',
  'Vehicle',
  'Retirement'
]

interface WhatMattersScreenProps {
  onNext: (selectedGoals: string[]) => void
}

export function WhatMattersScreen({ onNext }: WhatMattersScreenProps) {
  const [selected, setSelected] = useState<string[]>([])

  const toggleGoal = (goal: string) => {
    setSelected(prev => 
      prev.includes(goal) 
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    )
  }

  return (
    <div className="flex h-full flex-col justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="font-serif text-3xl font-medium tracking-tight sm:text-4xl">What matters to you?</h2>
        <p className="mt-3 text-muted-foreground">Select the goals you are currently working toward.</p>
      </motion.div>

      <div className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-3">
        {goals.map((goal, i) => {
          const isSelected = selected.includes(goal)
          return (
            <motion.button
              key={goal}
              onClick={() => toggleGoal(goal)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 + i * 0.04 }}
              className={`group flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm transition-all active:scale-95 ${
                isSelected 
                  ? 'border-primary bg-primary text-primary-foreground' 
                  : 'border-border bg-card/50 text-muted-foreground hover:border-primary/50 hover:text-foreground'
              }`}
            >
              <span>{goal}</span>
              {isSelected && <Check className="size-3.5" />}
            </motion.button>
          )
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-12 flex justify-center"
      >
        <button
          onClick={() => onNext(selected)}
          disabled={selected.length === 0}
          className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform hover:scale-[1.03] active:scale-95 disabled:pointer-events-none disabled:opacity-50"
        >
          Continue
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </button>
      </motion.div>
    </div>
  )
}
