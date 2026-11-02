'use client'

import { motion } from 'motion/react'

const lines = [
  { text: 'People do not need', muted: true },
  { text: 'more financial information.', muted: true },
  { text: 'People need', muted: false },
  { text: 'better financial outcomes.', muted: false },
]

export function BeliefSection() {
  return (
    <section id="belief" className="relative px-6 py-32 md:py-44">
      <div className="mx-auto max-w-4xl">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center text-xs uppercase tracking-[0.25em] text-primary"
        >
          The core belief
        </motion.p>
        <h2 className="text-center font-serif text-4xl font-medium leading-[1.12] tracking-tight text-balance sm:text-5xl md:text-6xl">
          {lines.map((line, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: i * 0.12, ease: [0.21, 0.6, 0.35, 1] }}
              className={`block ${line.muted ? 'text-muted-foreground' : 'text-foreground'}`}
            >
              {line.text}
            </motion.span>
          ))}
        </h2>
      </div>
    </section>
  )
}
