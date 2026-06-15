'use client'

import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

/**
 * The living presence of ONE's intelligence.
 * A calm, breathing orb — not a chatbot bubble, but a sense of being understood.
 */
export function OneOrb({
  size = 40,
  className,
  thinking = false,
}: {
  size?: number
  className?: string
  thinking?: boolean
}) {
  return (
    <span
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <motion.span
        className="absolute inset-0 rounded-full bg-primary/20 blur-md"
        animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: thinking ? 1.6 : 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.span
        className="absolute rounded-full"
        style={{
          inset: size * 0.18,
          background:
            'radial-gradient(circle at 35% 30%, var(--gold), var(--primary) 70%)',
        }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: thinking ? 1.2 : 3.4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.span
        className="absolute rounded-full bg-background/70"
        style={{ width: size * 0.16, height: size * 0.16, top: size * 0.26, left: size * 0.28 }}
        animate={{ opacity: [0.7, 0.95, 0.7] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
    </span>
  )
}

export function OneWordmark({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <OneOrb size={22} />
      <span className="font-serif text-xl font-semibold tracking-tight">ONE</span>
    </span>
  )
}
