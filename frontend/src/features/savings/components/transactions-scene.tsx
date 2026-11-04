'use client'

import { motion } from 'motion/react'
import { transactions, currency } from '@/lib/one-data'
import { SceneHeader } from '@/components/common/scene-header'
import { Search, Sparkles } from 'lucide-react'
import { OneOrb } from '@/components/common/one-mark'

export function TransactionsScene() {
  return (
    <div>
      <SceneHeader
        eyebrow="Transactions"
        title="Your money, categorized."
        subtitle="Every transaction is automatically categorized and analyzed for unusual spending patterns."
      />

      {/* AI Intelligence Card */}
      <div className="mb-6 flex items-start gap-4 rounded-3xl border border-primary/30 bg-accent p-6">
        <OneOrb size={32} />
        <div>
          <p className="font-medium text-accent-foreground">Spending Insights</p>
          <p className="mt-1 text-sm leading-relaxed text-accent-foreground/80 text-pretty">
            You are spending 12% less on dining out compared to last month. Keep it up!
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-4 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search transactions..."
            className="w-full rounded-full border border-border bg-card py-2 pl-9 pr-4 text-sm outline-none transition-colors focus:border-primary"
          />
        </div>
        <button className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary">
          Filters
        </button>
      </div>

      {/* Transactions List */}
      <div className="grid gap-3">
        {transactions.map((tx, i) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            className="group flex flex-col gap-2 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{tx.merchant}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">{tx.date}</span>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] uppercase tracking-wider text-secondary-foreground">
                    {tx.category}
                  </span>
                </div>
              </div>
              <p className={`font-serif text-lg font-medium ${tx.type === 'income' ? 'text-primary' : ''}`}>
                {tx.type === 'income' ? '+' : '-'}{currency(tx.amount)}
              </p>
            </div>
            {tx.aiInsight && (
              <div className="mt-2 flex items-start gap-2 rounded-xl bg-accent/50 p-3 text-xs text-accent-foreground">
                <Sparkles className="size-3.5 shrink-0 mt-0.5" />
                <p>{tx.aiInsight}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
