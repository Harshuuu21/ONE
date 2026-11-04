'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { OneOrb } from '@/components/common/one-mark'

export function LandingHero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pt-28 pb-20 text-center">
      {/* ambient field */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute left-1/3 top-2/3 h-72 w-72 rounded-full bg-gold/15 blur-[100px]" />
      </div>

      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="mb-10"
      >
        <OneOrb size={88} />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-muted-foreground backdrop-blur"
      >
        The AI Financial Operating System
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.42, duration: 0.9 }}
        className="max-w-4xl font-serif text-5xl font-medium leading-[1.05] tracking-tight text-balance sm:text-6xl md:text-7xl"
      >
        Better money decisions, every single day.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.58, duration: 0.9 }}
        className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty"
      >
        Not another dashboard. ONE is a living financial companion that understands
        you, guides you, and helps you grow — through intelligence, trust, and
        progress.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.74, duration: 0.9 }}
        className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
      >
        <Link
          href="/os"
          className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-medium text-primary-foreground transition-transform hover:scale-[1.03] active:scale-95"
        >
          Meet your ONE
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
        <a
          href="#intelligence"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-7 py-3.5 text-base font-medium text-foreground backdrop-blur transition-colors hover:bg-card"
        >
          See the first briefing
        </a>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.25em] text-muted-foreground"
      >
        <span className="animate-float-slow inline-block">Scroll</span>
      </motion.div>
    </section>
  )
}
