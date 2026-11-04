'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'motion/react'
import { MessageCircle, Heart, ShieldCheck, Users, HandHeart, Trophy } from 'lucide-react'
import { conversations, lendingRequests, lendingYou, currency, type LendingRequest } from '@/lib/one-data'
import { SceneHeader } from '@/components/common/scene-header'

const TOPICS = ['All', 'Mindset', 'Goals', 'Community', 'Trips', 'Debt']
type Tab = 'feed' | 'lending' | 'leaderboard'

export function CommunityScene() {
  const [activeTab, setActiveTab] = useState<Tab>('feed')
  const [backed, setBacked] = useState<LendingRequest | null>(null)

  return (
    <div className="pb-20">
      <SceneHeader
        eyebrow="Community"
        title="Money is emotional. People learn from people."
        subtitle="Real stories, shared goals, and community lending."
      />

      {/* Tabs */}
      <div className="mt-4 mb-6 flex gap-2 border-b border-border pb-px">
        {(['feed', 'lending', 'leaderboard'] as const).map((t) => (
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
                layoutId="community-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'feed' && (
          <motion.div
            key="feed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-5 flex flex-wrap gap-2">
              {TOPICS.map((t, i) => (
                <button
                  key={t}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    i === 0
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-border bg-card text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="grid gap-4">
              {conversations.map((c, i) => (
                <motion.article
                  key={c.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="group rounded-3xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={c.avatar || '/placeholder.svg'}
                      alt={c.author}
                      width={40}
                      height={40}
                      className="size-10 rounded-full object-cover"
                      style={{ width: 40, height: 40 }}
                    />
                    <div>
                      <p className="text-sm font-medium">{c.author}</p>
                      <p className="text-xs text-muted-foreground">{c.reputationTitle}</p>
                    </div>
                    <span className="ml-auto rounded-full bg-accent px-2.5 py-1 text-xs text-accent-foreground">
                      {c.topic}
                    </span>
                  </div>

                  <h3 className="mt-4 font-serif text-xl font-medium leading-snug tracking-tight text-balance">
                    {c.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground text-pretty">{c.excerpt}</p>

                  <div className="mt-4 flex items-center gap-5 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <MessageCircle className="size-4" />
                      {c.replies} replies
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Heart className="size-4" />
                      {c.helped} found this helpful
                    </span>
                    <span className="ml-auto font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      Read story
                    </span>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'lending' && (
          <motion.div
            key="lending"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
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
            
            <div className="mt-4 flex justify-center">
              <button className="flex items-center justify-center gap-2 rounded-full border border-dashed border-primary/40 bg-primary/5 px-6 py-3 font-medium text-primary transition-colors hover:border-primary hover:bg-primary/10">
                <HandHeart className="size-4" />
                Request Community Lending
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === 'leaderboard' && (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 rounded-2xl border border-primary bg-primary/5 p-4">
               <Trophy className="size-5 text-primary" />
               <div>
                 <p className="font-medium text-primary">You are in the Top 12%!</p>
                 <p className="text-sm text-primary/80">Your consistent saving and community support are paying off.</p>
               </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6">
              <h3 className="mb-4 font-serif text-lg font-medium">Top Community Contributors</h3>
              <div className="space-y-4">
                {[
                  { rank: 1, name: 'Priya S.', title: 'Trusted Lender', score: 868 },
                  { rank: 2, name: 'Maya (You)', title: 'Steady Builder', score: 824 },
                  { rank: 3, name: 'Daniel R.', title: 'Reliable', score: 791 },
                  { rank: 4, name: 'Lena M.', title: 'Mentor', score: 780 },
                ].map((member, i) => (
                  <div key={member.name} className="flex items-center justify-between border-b border-border/50 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-full bg-secondary text-sm font-medium text-secondary-foreground">
                        #{member.rank}
                      </div>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.title}</p>
                      </div>
                    </div>
                    <span className="font-serif text-lg text-primary">{member.score}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
