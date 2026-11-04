'use client'

import { motion } from 'motion/react'
import { reports, currency } from '@/lib/one-data'
import { SceneHeader } from '@/components/common/scene-header'

export function ReportsScene() {
  return (
    <div>
      <SceneHeader
        eyebrow="Reports"
        title="Your financial footprint."
        subtitle="Visualizing where your money goes and how your wealth grows over time."
      />

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="rounded-3xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Monthly Spending</p>
          <p className="mt-1 font-serif text-3xl font-medium tracking-tight">
            {currency(reports.monthlySpending)}
          </p>
        </div>
        <div className="rounded-3xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Monthly Savings</p>
          <p className="mt-1 font-serif text-3xl font-medium tracking-tight text-primary">
            {currency(reports.monthlySavings)}
          </p>
        </div>
      </div>

      {/* Category Breakdown (Simulated Chart) */}
      <p className="mb-3 text-sm font-medium text-muted-foreground">Spending Breakdown</p>
      <div className="rounded-3xl border border-border bg-card p-6">
        <div className="flex h-32 w-full items-end gap-2">
          {reports.categories.map((cat, i) => {
            const height = (cat.amount / Math.max(...reports.categories.map(c => c.amount))) * 100
            return (
              <div key={cat.label} className="group relative flex flex-1 flex-col items-center justify-end h-full">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }}
                  className={`w-full rounded-t-lg ${cat.color} transition-opacity hover:opacity-80`}
                />
                <div className="absolute -top-8 opacity-0 transition-opacity group-hover:opacity-100 bg-foreground text-background text-xs px-2 py-1 rounded">
                  {currency(cat.amount)}
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-4 flex justify-between text-xs text-muted-foreground">
          {reports.categories.map((cat) => (
            <div key={cat.label} className="flex-1 text-center truncate px-1">{cat.label}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
