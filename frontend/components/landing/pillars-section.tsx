'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  Sparkles,
  Target,
  ShieldCheck,
  HandHeart,
  MessagesSquare,
  Compass,
  Route,
  type LucideIcon,
} from 'lucide-react'

type Pillar = {
  id: string
  index: string
  name: string
  icon: LucideIcon
  headline: string
  body: string
}

const PILLARS: Pillar[] = [
  {
    id: 'intelligence',
    index: '01',
    name: 'Financial Intelligence',
    icon: Sparkles,
    headline: 'An operating system, not a chatbot.',
    body: 'ONE understands your behavior — not just your balance. It answers what happened, why, and what to do next, woven into every screen.',
  },
  {
    id: 'goals',
    index: '02',
    name: 'Life Goals',
    icon: Target,
    headline: 'People save for dreams, not balances.',
    body: 'Design your money around ambitions — a trip, a studio, a safety net. Goals here feel emotional, inspiring, and within reach.',
  },
  {
    id: 'reputation',
    index: '03',
    name: 'Financial Reputation',
    icon: ShieldCheck,
    headline: 'A new kind of financial identity.',
    body: 'Beyond credit scores. A reputation built from consistency, reliability, and growth — something you feel genuinely proud of.',
  },
  {
    id: 'lending',
    index: '04',
    name: 'Community Lending',
    icon: HandHeart,
    headline: 'Support real people. Earn real trust.',
    body: 'Request help when you need it. Back others when you can. A lending experience that feels human, meaningful, and empowering.',
  },
  {
    id: 'community',
    index: '05',
    name: 'Community Knowledge',
    icon: MessagesSquare,
    headline: 'Money is emotional. People learn from people.',
    body: 'Learn, share, and grow together in communities that feel alive — guidance from people who have lived what you are facing.',
  },
  {
    id: 'trips',
    index: '06',
    name: 'Trip Intelligence',
    icon: Compass,
    headline: 'Make travel exciting, not restrictive.',
    body: 'Plan, budget, and optimize trips with intelligence that watches prices and protects the magic of the journey.',
  },
  {
    id: 'journey',
    index: '07',
    name: 'Financial Journey',
    icon: Route,
    headline: 'See your past, present, and future as one story.',
    body: 'Most products show the present. ONE reveals your growth, momentum, and milestones — and celebrates how far you have come.',
  },
]

export function PillarsSection() {
  const [active, setActive] = useState(0)
  const current = PILLARS[active]

  return (
    <section id="pillars" className="relative px-6 py-28 md:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 max-w-2xl">
          <p className="mb-5 text-xs uppercase tracking-[0.25em] text-primary">
            The seven foundational pillars
          </p>
          <h2 className="font-serif text-4xl font-medium leading-tight tracking-tight text-balance md:text-5xl">
            One product. Seven ways it changes how money feels.
          </h2>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          {/* list */}
          <ul className="flex flex-col">
            {PILLARS.map((p, i) => {
              const Icon = p.icon
              const isActive = i === active
              return (
                <li key={p.id}>
                  <button
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    className={`group flex w-full items-center gap-4 border-b border-border py-5 text-left transition-colors ${
                      isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span className="font-mono text-xs tabular-nums text-muted-foreground">
                      {p.index}
                    </span>
                    <span
                      className={`flex size-9 shrink-0 items-center justify-center rounded-full transition-colors ${
                        isActive ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'
                      }`}
                    >
                      <Icon className="size-4" />
                    </span>
                    <span className="font-serif text-xl font-medium tracking-tight">
                      {p.name}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>

          {/* detail panel */}
          <div className="relative min-h-[20rem] overflow-hidden rounded-3xl border border-border bg-card p-8 md:p-10">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="relative flex h-full flex-col"
              >
                <current.icon className="size-9 text-primary" />
                <p className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {current.index} — {current.name}
                </p>
                <h3 className="mt-3 font-serif text-3xl font-medium leading-snug tracking-tight text-balance md:text-4xl">
                  {current.headline}
                </h3>
                <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
                  {current.body}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
