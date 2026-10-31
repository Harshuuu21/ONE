'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Lock, Check, ShieldCheck, Trophy, Compass, HandHeart } from 'lucide-react'
import { reputation, user } from '@/lib/one-data'
import { ProgressRing } from '../progress-ring'
import { SceneHeader } from '../scene-header'
import Image from 'next/image'

type Tab = 'reputation' | 'achievements' | 'history'

export function ReputationScene() {
  const [activeTab, setActiveTab] = useState<Tab>('reputation')

  return (
    <div className="pb-20">
      <div className="mb-6 flex items-center gap-4">
        <div className="flex size-16 items-center justify-center rounded-full bg-secondary text-xl font-medium text-secondary-foreground">
          {user.name.charAt(0)}
        </div>
        <div>
          <h2 className="font-serif text-3xl font-medium">{user.name}</h2>
          <p className="text-sm text-muted-foreground">Joined {user.joinedYear} · {user.reputationTitle}</p>
        </div>
      </div>

      <div className="mt-4 mb-6 flex gap-2 border-b border-border pb-px overflow-x-auto">
        {(['reputation', 'achievements', 'history'] as const).map((t) => (
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
                layoutId="profile-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'reputation' && (
          <motion.div
            key="reputation"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <SceneHeader
              eyebrow="Financial reputation"
              title="An identity you're proud of."
              subtitle="Not a credit score. A living reflection of how consistently, reliably, and generously you handle money."
            />

            {/* hero score */}
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 text-center mb-6">
              <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />
              <div className="relative mx-auto w-fit">
                <ProgressRing value={reputation.score / reputation.max} size={180} stroke={10} tone="gold">
                  <div>
                    <motion.p
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                      className="font-serif text-5xl font-medium tracking-tight"
                    >
                      {reputation.score}
                    </motion.p>
                    <p className="text-xs text-muted-foreground">of {reputation.max}</p>
                  </div>
                </ProgressRing>
              </div>
              <p className="mt-5 font-serif text-2xl font-medium">{reputation.title}</p>
              <p className="mt-1 text-sm text-primary">{reputation.percentile}</p>
            </div>

            {/* facets */}
            <div className="grid gap-3 sm:grid-cols-2">
              {reputation.facets.map((f, i) => (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="rounded-2xl border border-border bg-card p-5"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{f.label}</p>
                    <p className="font-serif text-lg font-medium text-primary">{f.value}</p>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${f.value}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{f.note}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'achievements' && (
          <motion.div
            key="achievements"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <p className="mb-4 text-sm font-medium text-muted-foreground">Milestones unlocked</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {reputation.milestones.map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-center ${
                    m.unlocked ? 'border-primary/30 bg-accent' : 'border-dashed border-border bg-card/40'
                  }`}
                >
                  <span
                    className={`flex size-9 items-center justify-center rounded-full ${
                      m.unlocked ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                    }`}
                  >
                    {m.unlocked ? <Check className="size-4" /> : <Lock className="size-4" />}
                  </span>
                  <p className="text-sm font-medium leading-tight text-balance">{m.title}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div>
              <h3 className="mb-3 font-serif text-xl font-medium">Lending History</h3>
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-4 border-b border-border/50 pb-4 mb-4">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <HandHeart className="size-5" />
                  </div>
                  <div>
                    <p className="font-medium">Backed Daniel R.</p>
                    <p className="text-xs text-muted-foreground">Repaid on time · Earned +12 Trust Score</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <HandHeart className="size-5" />
                  </div>
                  <div>
                    <p className="font-medium">Backed Priya S.</p>
                    <p className="text-xs text-muted-foreground">Currently backing · 2 months left</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-3 font-serif text-xl font-medium">Travel History</h3>
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-4">
                  <div className="flex size-10 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                    <Compass className="size-5" />
                  </div>
                  <div>
                    <p className="font-medium">No trips completed yet</p>
                    <p className="text-xs text-muted-foreground">Your upcoming trip to Japan will appear here.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
