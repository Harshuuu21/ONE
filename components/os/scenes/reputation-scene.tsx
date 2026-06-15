'use client'

import { motion } from 'motion/react'
import { Lock, Check } from 'lucide-react'
import { reputation } from '@/lib/one-data'
import { ProgressRing } from '../progress-ring'
import { SceneHeader } from '../scene-header'

export function ReputationScene() {
  return (
    <div>
      <SceneHeader
        eyebrow="Financial reputation"
        title="An identity you're proud of."
        subtitle="Not a credit score. A living reflection of how consistently, reliably, and generously you handle money."
      />

      {/* hero score */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 text-center">
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
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
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

      {/* milestones */}
      <p className="mb-3 mt-8 text-sm font-medium text-muted-foreground">Reputation milestones</p>
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
    </div>
  )
}
