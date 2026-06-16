'use client'

import { motion } from 'motion/react'

const roles = [
  'Student',
  'Professional',
  'Freelancer',
  'Business Owner',
  'Creator',
  'Other'
]

interface AboutYouScreenProps {
  onSelect: (role: string) => void
}

export function AboutYouScreen({ onSelect }: AboutYouScreenProps) {
  return (
    <div className="flex h-full flex-col justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="font-serif text-3xl font-medium tracking-tight sm:text-4xl">Who are you?</h2>
        <p className="mt-3 text-muted-foreground">Select the role that best describes you.</p>
      </motion.div>

      <div className="mx-auto mt-12 grid w-full max-w-2xl grid-cols-2 gap-4 sm:grid-cols-3">
        {roles.map((role, i) => (
          <motion.button
            key={role}
            onClick={() => onSelect(role)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
            className="group flex aspect-square flex-col items-center justify-center rounded-2xl border border-border bg-card/50 p-6 transition-all hover:border-primary/50 hover:bg-card active:scale-[0.98]"
          >
            <span className="font-medium text-muted-foreground transition-colors group-hover:text-foreground">
              {role}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
