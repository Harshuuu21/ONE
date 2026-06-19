'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'motion/react'
import { CalendarDays, Users, CloudSun, MapPin, BookOpen } from 'lucide-react'
import { trip, currency } from '@/lib/one-data'
import { OneOrb } from '@/components/one-mark'
import { SceneHeader } from '../scene-header'

type Tab = 'funding' | 'itinerary' | 'community'

export function TripScene() {
  const [activeTab, setActiveTab] = useState<Tab>('funding')
  
  const pct = Math.round((trip.saved / trip.budget) * 100)
  const spentPct = Math.round((trip.spent / trip.budget) * 100)
  const maxPlanned = Math.max(...trip.breakdown.map((b) => b.planned))

  return (
    <div className="pb-20">
      <SceneHeader
        eyebrow="Trip intelligence"
        title="Travel should feel exciting, not restrictive."
      />

      {/* hero */}
      <div className="relative overflow-hidden rounded-3xl border border-border">
        <div className="relative h-64">
          <Image src={trip.image || '/placeholder.svg'} alt={trip.destination} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
          <div className="absolute bottom-5 left-6 right-6 text-background">
            <div className="flex items-center justify-between mb-1">
               <p className="font-serif text-4xl font-medium">{trip.destination}</p>
               {trip.weather && (
                 <div className="flex items-center gap-2 bg-background/20 backdrop-blur-md px-3 py-1.5 rounded-full text-sm font-medium">
                   <CloudSun className="size-4" /> {trip.weather.temp}°C {trip.weather.condition}
                 </div>
               )}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-background/90">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-4" /> {trip.dates} · {trip.days} days
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="size-4" /> {trip.travelers} travelers
              </span>
              {trip.budgetTier && (
                <span className="inline-flex items-center gap-1.5 bg-primary/80 px-2.5 py-0.5 rounded-full text-xs font-semibold text-primary-foreground capitalize tracking-wide">
                  {trip.budgetTier}
                </span>
              )}
            </div>
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

      {/* Tabs */}
      <div className="mt-8 flex gap-2 border-b border-border pb-px">
        {(['funding', 'itinerary', 'community'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              activeTab === t ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="capitalize">{t}</span>
            {activeTab === t && (
              <motion.div
                layoutId="trip-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              />
            )}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <AnimatePresence mode="wait">
          {activeTab === 'funding' && (
            <motion.div
              key="funding"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* funding status */}
              <div className="bg-card rounded-3xl border border-border p-6 mb-6">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{trip.status === 'active' ? 'Spent so far' : 'Funded so far'}</p>
                    <p className="font-serif text-3xl font-medium tracking-tight">
                      {currency(trip.status === 'active' ? trip.spent : trip.saved)}{' '}
                      <span className="text-lg text-muted-foreground">/ {currency(trip.budget)}</span>
                    </p>
                  </div>
                  <p className="font-serif text-2xl font-medium text-primary">{trip.status === 'active' ? spentPct : pct}%</p>
                </div>
                <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${trip.status === 'active' ? spentPct : pct}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>

              {/* budget breakdown */}
              <p className="mb-3 text-sm font-medium text-muted-foreground">Where it goes</p>
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
                      <p className="font-serif text-lg font-medium tracking-tight">
                        {trip.status === 'active' && b.spent > 0 ? (
                          <span>{currency(b.spent)} <span className="text-sm text-muted-foreground">/ {currency(b.planned)}</span></span>
                        ) : (
                          currency(b.planned)
                        )}
                      </p>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                      <motion.div
                        className={`h-full rounded-full ${trip.status === 'active' && b.spent > b.planned ? 'bg-destructive' : 'bg-primary/70'}`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${((trip.status === 'active' ? b.spent : b.planned) / maxPlanned) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, ease: 'easeOut' }}
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-muted-foreground">{b.tone}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'itinerary' && (
            <motion.div
              key="itinerary"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {trip.itinerary?.map((day) => (
                <div key={day.day} className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">
                      {day.day}
                    </div>
                    <h4 className="font-serif text-lg font-medium">{day.title}</h4>
                  </div>
                  <ul className="space-y-2 pl-11">
                    {day.activities.map((act, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <MapPin className="size-4 mt-0.5 shrink-0 text-primary/60" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'community' && (
            <motion.div
              key="community"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <p className="text-sm text-muted-foreground mb-4">Connect with others who traveled to {trip.destination}.</p>
              {trip.communities?.map((comm, i) => (
                <div key={i} className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-secondary text-primary">
                      <BookOpen className="size-5" />
                    </div>
                    <div>
                      <p className="font-medium">{comm.name}</p>
                      <p className="text-xs text-muted-foreground">{comm.members} members · {comm.type}</p>
                    </div>
                  </div>
                  <button className="text-sm font-medium text-primary hover:underline">Join</button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
