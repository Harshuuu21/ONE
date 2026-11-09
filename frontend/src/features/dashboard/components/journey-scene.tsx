'use client'

import { motion } from 'motion/react'
import { journey, currency } from '@/lib/one-data'
import { SceneHeader } from '@/components/common/scene-header'
import { useDemoData } from '@/hooks/useDemoData'

export function JourneyScene() {
  const { summary } = useDemoData()

  const netWorthNow = summary?.financials?.closingBalance ?? journey.netWorthNow
  const netWorthStart = summary?.financials?.initialBalance ?? journey.netWorthStart
  const growth = netWorthStart > 0
    ? Math.round(((netWorthNow - netWorthStart) / netWorthStart) * 100)
    : 15

  const points = summary?.recentTransactions && summary.recentTransactions.length > 0
    ? summary.recentTransactions.slice(0, 7).map((t, idx) => ({
        month: new Date(t.date).toLocaleDateString(undefined, { month: 'short' }),
        value: Math.round(netWorthStart + (idx + 1) * ((netWorthNow - netWorthStart) / 7)),
      }))
    : journey.points

  const values = points.map((p) => p.value)
  const min = Math.min(...values)
  const max = Math.max(...values, min + 1)
  const w = 600
  const h = 200
  const pts = points.map((p, i) => {
    const x = (i / Math.max(1, points.length - 1)) * w
    const y = h - ((p.value - min) / (max - min)) * (h - 24) - 12
    return [x, y] as const
  })
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x},${y}`).join(' ')
  const area = `${line} L${w},${h} L0,${h} Z`

  return (
    <div>
      <SceneHeader
        eyebrow="Your financial journey"
        title="Look how far you've come."
        subtitle="Most apps only show today. ONE remembers where you started — and shows you the line that connects it all."
      />

      {/* growth headline */}
      <div className="mb-4 flex flex-wrap items-end gap-x-8 gap-y-3 rounded-3xl border border-border bg-card p-6">
        <div>
          <p className="text-sm text-muted-foreground">Net worth today</p>
          <p className="font-serif text-4xl font-medium tracking-tight">
            ₹{netWorthNow.toLocaleString('en-IN')}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Since start</p>
          <p className="font-serif text-2xl font-medium tracking-tight text-primary">
            +{growth}%
          </p>
        </div>
        <p className="ml-auto max-w-xs text-sm leading-relaxed text-muted-foreground">
          That&apos;s ₹{Math.abs(netWorthNow - netWorthStart).toLocaleString('en-IN')} of liquid momentum — but
          the streak behind it matters more.
        </p>
      </div>

      {/* growth chart */}
      <div className="mb-4 overflow-hidden rounded-3xl border border-border bg-card p-6">
        <svg viewBox={`0 0 ${w} ${h}`} className="h-48 w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.22" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path
            d={area}
            fill="url(#growthFill)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          />
          <motion.path
            d={line}
            fill="none"
            stroke="var(--primary)"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.6, ease: 'easeInOut' }}
          />
          {pts.map(([x, y], i) => (
            <motion.circle
              key={i}
              cx={x}
              cy={y}
              r={4}
              fill="var(--background)"
              stroke="var(--primary)"
              strokeWidth={2}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.18 }}
            />
          ))}
        </svg>
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          {journey.points.map((p) => (
            <span key={p.label}>{p.label}</span>
          ))}
        </div>
      </div>

      {/* milestones timeline */}
      <p className="mb-3 text-sm font-medium text-muted-foreground">Milestones</p>
      <ol className="relative ml-2 border-l border-border">
        {journey.milestones.map((m, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="mb-6 ml-6"
          >
            <span className="absolute -left-[7px] mt-1.5 size-3.5 rounded-full border-2 border-background bg-primary" />
            <p className="font-mono text-xs uppercase tracking-wider text-primary">{m.year}</p>
            <p className="mt-1 font-serif text-lg font-medium">{m.title}</p>
            <p className="text-sm leading-relaxed text-muted-foreground">{m.note}</p>
          </motion.li>
        ))}
      </ol>
    </div>
  )
}
