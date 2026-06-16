'use client'

import Image from 'next/image'
import { motion } from 'motion/react'
import { Sparkles, CalendarDays, Users } from 'lucide-react'
import { trip, currency } from '@/lib/one-data'
import { OneOrb } from '@/components/one-mark'
import { SceneHeader } from '../scene-header'

export function TripScene() {
  const pct = Math.round((trip.saved / trip.budget) * 100)
  const maxPlanned = Math.max(...trip.breakdown.map((b) => b.planned))

  return (
    <div>
      <SceneHeader
        eyebrow="Trip intelligence"
        title="Travel should feel exciting, not restrictive."
      />

      {/* hero */}
      <div className="relative overflow-hidden rounded-3xl border border-border">
        <div className="relative h-56">
          <Image src={trip.image || '/placeholder.svg'} alt={trip.destination} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
          <div className="absolute bottom-5 left-6 right-6 text-background">
            <p className="font-serif text-3xl font-medium">{trip.destination}</p>
            <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-background/90">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-4" /> {trip.dates} · {trip.days} days
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="size-4" /> {trip.travelers} travelers
              </span>
            </div>
          </div>
        </div>

        {/* funding */}
        <div className="bg-card p-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Funded so far</p>
              <p className="font-serif text-3xl font-medium tracking-tight">
                {currency(trip.saved)}{' '}
                <span className="text-lg text-muted-foreground">/ {currency(trip.budget)}</span>
              </p>
            </div>
            <p className="font-serif text-2xl font-medium text-primary">{pct}%</p>
          </div>
          <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-secondary">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* AI intelligence note */}
      <div className="mt-4 flex items-start gap-3 rounded-3xl border border-primary/30 bg-accent p-5">
        <OneOrb size={32} />
        <div>
          <p className="text-sm font-medium text-accent-foreground">ONE is watching this trip for you</p>
          <p className="mt-1 text-sm leading-relaxed text-accent-foreground/80 text-pretty">
            {trip.intelligence}
          </p>
        </div>
      </div>

      {/* budget breakdown */}
      <p className="mb-3 mt-8 text-sm font-medium text-muted-foreground">Where it goes</p>
      <div className="grid gap-3">
        {trip.breakdown.map((b, i) => (
          <motion.div
            key={b.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07, duration: 0.45 }}
            className="rounded-2xl border border-border bg-card p-4"
          >
            <div className="flex items-center justify-between">
              <p className="font-medium">{b.label}</p>
              <p className="font-serif text-lg font-medium tracking-tight">{currency(b.planned)}</p>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
              <motion.div
                className="h-full rounded-full bg-primary/70"
                initial={{ width: 0 }}
                whileInView={{ width: `${(b.planned / maxPlanned) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
              />
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">{b.tone}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
