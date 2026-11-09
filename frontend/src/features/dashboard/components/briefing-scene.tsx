'use client'

import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { ArrowUpRight, TrendingUp, AlertCircle, Trophy } from 'lucide-react'
import { briefing, insights, currency, goals, conversations, trip } from '@/lib/one-data'
import { OneOrb } from '@/components/common/one-mark'
import { SceneHeader } from '@/components/common/scene-header'

import { useAuth } from '@/hooks/useAuth'
import { useBankAccounts } from '@/features/bank-accounts'
import { useDemoData } from '@/hooks/useDemoData'
import { DemoDataBanner } from '@/components/demo-data/DemoDataBanner'

const ICONS = {
  opportunity: TrendingUp,
  caution: AlertCircle,
  win: Trophy,
  nudge: TrendingUp,
}

function getTimeGreeting() {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) {
    return {
      salutation: 'Good morning',
      eyebrow: 'Your morning briefing',
    }
  }
  if (hour >= 12 && hour < 17) {
    return {
      salutation: 'Good afternoon',
      eyebrow: 'Your afternoon briefing',
    }
  }
  return {
    salutation: 'Good evening',
    eyebrow: 'Your evening briefing',
  }
}

export function BriefingScene() {
  const { user } = useAuth()
  const { linkedAccounts, totalBalance } = useBankAccounts()
  const { summary, isResetting, resetDemoData } = useDemoData()
  const [timeContext, setTimeContext] = useState(getTimeGreeting)

  useEffect(() => {
    setTimeContext(getTimeGreeting())
    const interval = setInterval(() => {
      setTimeContext(getTimeGreeting())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  const displayName = user?.firstName || 'Maya'
  const greeting = `${timeContext.salutation}, ${displayName}`

  const displaySafeToSpend = linkedAccounts.length > 0
    ? Math.round(totalBalance * 0.05) // Safe 5% liquid threshold
    : summary?.financials?.closingBalance
    ? Math.round(summary.financials.closingBalance * 0.08)
    : briefing.safeToSpend

  const headlineText = summary
    ? `You're ₹${Math.abs(summary.financials.netSavings).toLocaleString('en-IN')} ahead of where you were last month.`
    : briefing.headline

  const summaryText = summary
    ? `Spending settled at ₹${summary.financials.totalExpenses.toLocaleString('en-IN')} across ${summary.metrics.transactionsCount} transactions. Your ${summary.goals[0]?.title || 'top savings goal'} is at ${summary.goals[0]?.progressPercentage || 50}% progress.`
    : briefing.summary

  const topGoal = summary?.goals?.[0] || {
    title: goals[0].title,
    currentAmount: goals[0].saved,
    targetAmount: goals[0].target,
    progressPercentage: Math.round((goals[0].saved / goals[0].target) * 100),
  }

  const topCommunity = summary?.communities?.[0] || {
    name: 'Top 12% Contributor',
    progress: 57,
  }

  return (
    <div>
      {/* Demo Data Environment Banner */}
      {summary && (
        <DemoDataBanner
          persona={summary.persona}
          onReset={resetDemoData}
          isResetting={isResetting}
        />
      )}

      <SceneHeader eyebrow={timeContext.eyebrow} title={greeting} />

      {/* the headline insight */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-7 md:p-9">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex items-start gap-4">
          <OneOrb size={40} />
          <div>
            <p className="font-serif text-2xl font-medium leading-snug text-balance md:text-3xl">
              {headlineText}
            </p>
            <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
              {summaryText}
            </p>
          </div>
        </div>
      </div>

      {/* safe to spend */}
      <div className="mt-4 grid gap-4 sm:grid-cols-[1.2fr_1fr]">
        <div className="rounded-3xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Safe to spend today</p>
          <p className="mt-1 font-serif text-4xl font-medium tracking-tight">
            {currency(displaySafeToSpend)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {linkedAccounts.length > 0
              ? `Calculated from ₹${totalBalance.toLocaleString('en-IN')} across ${linkedAccounts.length} linked accounts`
              : summary
              ? `Reconciled from ₹${summary.financials.closingBalance.toLocaleString('en-IN')} closing balance`
              : briefing.safeToSpendNote}
          </p>
        </div>
        <div className="flex flex-col justify-center rounded-3xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">This month&apos;s momentum</p>
          <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-secondary">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${(summary?.financials?.savingsRatePercentage || briefing.momentum * 100)}%` }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
            />
          </div>
          <p className="mt-2 text-sm font-medium text-primary">
            {summary ? `${summary.financials.savingsRatePercentage}% Savings Rate` : 'Strong and steady'}
          </p>
        </div>
      </div>

      {/* Command Center Summaries */}
      <p className="mb-3 mt-8 text-sm font-medium text-muted-foreground">
        Active Priorities
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        {/* Goals Summary */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs text-muted-foreground mb-1">Top Goal</p>
          <p className="font-medium truncate">{topGoal.title}</p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${topGoal.progressPercentage}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <p className="mt-1.5 text-[11px] text-muted-foreground">{topGoal.progressPercentage}% completed</p>
        </div>

        {/* Trips Summary */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs text-muted-foreground mb-1">Upcoming Trip</p>
          <p className="font-medium truncate">{trip.destination}</p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${Math.round((trip.saved / trip.budget) * 100)}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <p className="mt-1.5 text-[11px] text-muted-foreground">{Math.round((trip.saved / trip.budget) * 100)}% funded</p>
        </div>

        {/* Community Summary */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs text-muted-foreground mb-1">Community Circle</p>
          <p className="font-medium truncate">{topCommunity.name}</p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <motion.div
              className="h-full rounded-full bg-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${topCommunity.progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <p className="mt-1.5 text-[11px] text-emerald-600 dark:text-emerald-400">{topCommunity.progress}% pooled</p>
        </div>
      </div>

      {/* insight cards */}
      <p className="mb-3 mt-8 text-sm font-medium text-muted-foreground">
        What I&apos;d do next
      </p>
      <div className="grid gap-3">
        {insights.map((ins, i) => {
          const Icon = ICONS[ins.kind]
          return (
            <motion.div
              key={ins.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
              className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
            >
              <span
                className={`flex size-10 shrink-0 items-center justify-center rounded-full ${
                  ins.kind === 'caution'
                    ? 'bg-gold/20 text-gold-foreground'
                    : 'bg-accent text-accent-foreground'
                }`}
              >
                <Icon className="size-5" />
              </span>
              <div className="flex-1">
                <p className="font-medium">{ins.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{ins.body}</p>
              </div>
              <button className="flex items-center gap-1 self-center rounded-full bg-secondary px-3.5 py-2 text-sm font-medium text-secondary-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                {ins.action}
                <ArrowUpRight className="size-3.5" />
              </button>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
