'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
import { OneOrb } from '@/components/common/one-mark'

const fullText =
  "Good morning, Maya. You're ahead of where you were last month. Spending settled 9% below your usual pace, and your Japan fund just crossed halfway. There's one subscription you may have forgotten — want me to handle it?"

export function AiCharacterSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-120px' })
  const [typed, setTyped] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!inView) return
    let i = 0
    const id = setInterval(() => {
      i += 2
      setTyped(fullText.slice(0, i))
      if (i >= fullText.length) {
        clearInterval(id)
        setDone(true)
      }
    }, 22)
    return () => clearInterval(id)
  }, [inView])

  return (
    <section id="intelligence" className="relative px-6 py-28 md:py-36">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
        <div>
          <p className="mb-5 text-xs uppercase tracking-[0.25em] text-primary">
            AI is the main character
          </p>
          <h2 className="font-serif text-4xl font-medium leading-tight tracking-tight text-balance md:text-5xl">
            Not product plus AI. Intelligence, woven into your whole financial life.
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
            Most apps hand you data and wish you luck. ONE understands what happened,
            why it happened, and what you should do next — then quietly does the work
            with you.
          </p>
          <div className="mt-8 grid gap-3 text-sm">
            {[
              ['What happened', 'Reads your week without you lifting a finger.'],
              ['Why it happened', 'Connects behavior to outcomes, gently.'],
              ['What to do next', 'Turns insight into one clear, doable move.'],
            ].map(([k, v]) => (
              <div key={k} className="flex items-start gap-3">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                <p>
                  <span className="font-medium text-foreground">{k}. </span>
                  <span className="text-muted-foreground">{v}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* The briefing card — first wow moment */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40, rotateX: 8 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: '-120px' }}
          transition={{ duration: 1, ease: [0.21, 0.6, 0.35, 1] }}
          className="relative rounded-3xl border border-border bg-card p-7 shadow-[0_30px_80px_-40px_rgba(40,60,45,0.35)]"
        >
          <div className="flex items-center gap-3 border-b border-border/70 pb-5">
            <OneOrb size={36} thinking={!done} />
            <div>
              <p className="text-sm font-medium">Your morning briefing</p>
              <p className="text-xs text-muted-foreground">
                {done ? 'Ready' : 'Thinking through your week…'}
              </p>
            </div>
          </div>
          <p className="min-h-[7rem] pt-5 font-serif text-xl leading-relaxed text-pretty">
            {typed}
            {!done && <span className="ml-0.5 inline-block h-5 w-0.5 animate-pulse bg-primary align-middle" />}
          </p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={done ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mt-4 flex flex-wrap gap-2"
          >
            <button className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03] active:scale-95">
              Yes, cancel it
            </button>
            <button className="rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary">
              Move $200 to Japan
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
