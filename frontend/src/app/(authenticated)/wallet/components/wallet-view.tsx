'use client'

import { useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'motion/react'
import { ShieldCheck, Users, HandHeart, Heart } from 'lucide-react'
import { lendingRequests, lendingYou, currency, type LendingRequest } from '@/lib/one-data'
import { SceneHeader } from '@/components/common/scene-header'

export function LendingScene() {
  const [backed, setBacked] = useState<LendingRequest | null>(null)

  return (
    <div>
      <SceneHeader
        eyebrow="Community lending"
        title="Money, made human again."
        subtitle="Back real people with real plans. Build trust both ways. Every loan repaid strengthens the whole community."
      />

      {/* your standing */}
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Trust circle', value: lendingYou.trustCircle, icon: Users },
          { label: 'Backing now', value: lendingYou.activelyBacking, icon: HandHeart },
          { label: 'Total backed', value: currency(lendingYou.totalBacked), icon: Heart },
          { label: 'On-time rate', value: `${lendingYou.onTimeRate}%`, icon: ShieldCheck },
        ].map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-4">
              <Icon className="size-4 text-primary" />
              <p className="mt-2 font-serif text-xl font-medium tracking-tight">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          )
        })}
      </div>

      <p className="mb-3 text-sm font-medium text-muted-foreground">People who could use a hand</p>
      <div className="grid gap-4">
        {lendingRequests.map((r, i) => {
          const pct = Math.round((r.funded / r.amount) * 100)
          return (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="rounded-3xl border border-border bg-card p-6"
            >
              <div className="flex items-start gap-4">
                <Image
                  src={r.avatar || '/placeholder.svg'}
                  alt={r.name}
                  width={52}
                  height={52}
                  className="size-13 rounded-full object-cover"
                  style={{ width: 52, height: 52 }}
                />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{r.name}</p>
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">
                      <ShieldCheck className="size-3" />
                      {r.reputationTitle} · {r.reputation}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm font-medium text-primary">{r.reason}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
                    {r.story}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-end justify-between text-sm">
                  <span className="font-medium">
                    {currency(r.funded)}{' '}
                    <span className="text-muted-foreground">of {currency(r.amount)}</span>
                  </span>
                  <span className="text-muted-foreground">
                    {r.backers} backers · {r.termMonths} mo
                  </span>
                </div>
                <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>

              <button
                onClick={() => setBacked(r)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 font-medium text-primary-foreground transition-transform hover:scale-[1.01] active:scale-95"
              >
                <HandHeart className="size-4" />
                Back {r.name.split(' ')[0]}
              </button>
            </motion.div>
          )
        })}
      </div>

      {/* recognition wow moment */}
      <AnimatePresence>
        {backed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-6 backdrop-blur-sm"
            onClick={() => setBacked(null)}
          >
            <motion.div
              initial={{ scale: 0.85, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-3xl border border-border bg-card p-8 text-center"
            >
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary/15 text-primary">
                <HandHeart className="size-6" />
              </div>
              <p className="font-serif text-2xl font-medium tracking-tight">
                You backed {backed.name.split(' ')[0]}.
              </p>
              <p className="mt-2 leading-relaxed text-muted-foreground text-pretty">
                That&apos;s real support, not a transaction. Your reliability score just grew,
                and {backed.name.split(' ')[0]} will know someone believed in the plan.
              </p>
              <button
                onClick={() => setBacked(null)}
                className="mt-6 w-full rounded-full bg-primary py-3 font-medium text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95"
              >
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
