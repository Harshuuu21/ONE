'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { OneOrb, OneWordmark } from '@/components/one-mark'

const feelings = ['Confident', 'Motivated', 'Supported', 'In control', 'Proud', 'Understood']

export function LandingCta() {
  return (
    <section className="relative px-6 pb-16 pt-28 md:pt-40">
      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-10 flex justify-center">
          <OneOrb size={64} />
        </div>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="font-serif text-4xl font-medium leading-[1.08] tracking-tight text-balance sm:text-5xl md:text-6xl"
        >
          The future of personal finance feels like having someone in your corner.
        </motion.h2>

        <div className="mt-10 flex flex-wrap justify-center gap-2.5">
          {feelings.map((f, i) => (
            <motion.span
              key={f}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground"
            >
              {f}
            </motion.span>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-12"
        >
          <Link
            href="/onboarding"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-medium text-primary-foreground transition-transform hover:scale-[1.03] active:scale-95"
          >
            Enter ONE
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">
            A guided, simulated experience. No account needed.
          </p>
        </motion.div>
      </div>

      <footer className="mx-auto mt-28 flex max-w-6xl flex-col items-center justify-between gap-6 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row">
        <OneWordmark />
        <p className="text-balance text-center">
          Help people make better financial decisions every day.
        </p>
        <p>© {new Date().getFullYear()} ONE</p>
      </footer>
    </section>
  )
}
