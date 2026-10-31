'use client'

import { useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'motion/react'
import { Plus, Sparkles } from 'lucide-react'
import { goals, currency, type Goal } from '@/lib/one-data'
import { SceneHeader } from '../scene-header'
import { CreateGoalModal } from '../create-goal-modal'
function GoalCard({ goal, onContribute }: { goal: Goal; onContribute: (g: Goal) => void }) {
  const pct = Math.round((goal.saved / goal.target) * 100)
  return (
    <motion.div
      layout
      className="group relative overflow-hidden rounded-3xl border border-border bg-card"
    >
      <div className="relative h-40 overflow-hidden">
        <Image
          src={goal.image || '/placeholder.svg'}
          alt={goal.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <p className="font-serif text-xl font-medium text-foreground">{goal.title}</p>
          <p className="text-sm text-muted-foreground">{goal.tone}</p>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-end justify-between">
          <p className="font-serif text-2xl font-medium tracking-tight">
            {currency(goal.saved)}
          </p>
          <p className="text-sm text-muted-foreground">of {currency(goal.target)}</p>
        </div>
        <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-secondary">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: 0 }}
            whileInView={{ width: `${pct}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {pct}% · about {goal.etaMonths} months left
          </p>
          <button
            onClick={() => onContribute(goal)}
            className="rounded-full bg-secondary px-3.5 py-1.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Add {currency(goal.monthly)}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export function GoalsScene() {
  const [celebrate, setCelebrate] = useState<Goal | null>(null)
  const [activeGoals, setActiveGoals] = useState<Goal[]>(goals)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const handleCreateGoal = (newGoal: Goal) => {
    setActiveGoals((prev) => [...prev, newGoal])
  }

  return (
    <div>
      <SceneHeader
        eyebrow="Life goals"
        title="You don't save for money. You save for this."
        subtitle="Every goal is a dream with a plan attached. ONE keeps each one moving, quietly, in the background."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {activeGoals.map((g) => (
          <GoalCard key={g.id} goal={g} onContribute={setCelebrate} />
        ))}

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex min-h-[7rem] items-center justify-center gap-2 rounded-3xl border border-dashed border-border bg-card/40 p-5 text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
          >
            <Plus className="size-5" />
            <span className="font-medium">Dream up a new goal</span>
          </button>

          <button className="flex flex-col min-h-[7rem] items-center justify-center gap-2 rounded-3xl border border-primary/30 bg-accent p-5 text-accent-foreground transition-colors hover:border-primary/50">
            <div className="flex items-center gap-2 font-medium">
              <Sparkles className="size-4" />
              <span>AI Goal Forecasting</span>
            </div>
            <span className="text-xs text-center text-accent-foreground/80">
              See what happens if you increase monthly savings by $50.
            </span>
          </button>
        </div>
      </div>

      {/* celebration wow moment */}
      <AnimatePresence>
        {celebrate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-6 backdrop-blur-sm"
            onClick={() => setCelebrate(null)}
          >
            <motion.div
              initial={{ scale: 0.85, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-border bg-card p-8 text-center"
            >
              {/* confetti-ish particles */}
              {Array.from({ length: 14 }).map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute left-1/2 top-1/3 size-2 rounded-full"
                  style={{ backgroundColor: i % 2 ? 'var(--gold)' : 'var(--primary)' }}
                  initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                  animate={{
                    opacity: 0,
                    x: (Math.random() - 0.5) * 280,
                    y: (Math.random() - 0.5) * 220,
                    scale: 0,
                  }}
                  transition={{ duration: 1.1, delay: 0.1, ease: 'easeOut' }}
                />
              ))}
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-gold/20 text-gold-foreground">
                <Sparkles className="size-6" />
              </div>
              <p className="font-serif text-2xl font-medium tracking-tight">
                {currency(celebrate.monthly)} added
              </p>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                {celebrate.title} just moved closer. At this pace you&apos;re ahead of
                schedule — I&apos;ll keep watching for ways to speed it up.
              </p>
              <button
                onClick={() => setCelebrate(null)}
                className="mt-6 w-full rounded-full bg-primary py-3 font-medium text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95"
              >
                Beautiful
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CreateGoalModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateGoal}
      />
    </div>
  )
}
