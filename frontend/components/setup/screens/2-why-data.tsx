'use client'

import { ArrowRight, CheckCircle2 } from 'lucide-react'

export function WhyDataScreen({ onNext }: { onNext: () => void }) {
  const reasons = [
    'Track expenses automatically',
    'Categorize spending using AI',
    'Generate monthly financial reports',
    'Build personalized budgets',
    'Predict future cash flow',
    'Recommend savings',
    'Enable secure community lending',
  ]

  return (
    <div className="flex flex-col space-y-8">
      <div className="space-y-4">
        <h2 className="text-3xl font-serif font-semibold tracking-tight">
          Why ONE Needs Your Data
        </h2>
        <p className="text-muted-foreground text-lg">
          ONE uses your financial data to:
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
        {reasons.map((reason, i) => (
          <div key={i} className="flex items-start gap-3">
            <CheckCircle2 className="size-5 text-primary shrink-0 mt-0.5" />
            <span className="text-base text-foreground font-medium">{reason}</span>
          </div>
        ))}
      </div>

      <div className="pt-6">
        <button
          onClick={onNext}
          className="flex items-center justify-center gap-2 w-full max-w-sm mx-auto rounded-full bg-primary px-6 py-4 text-base font-medium text-primary-foreground transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          Continue
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  )
}
