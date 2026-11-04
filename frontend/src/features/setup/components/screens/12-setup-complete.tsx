'use client'

import { ArrowRight, BadgeCheck, CheckCircle2, Building2, BrainCircuit, Users, RefreshCcw } from 'lucide-react'
import { OneOrb } from '@/components/common/one-mark'

export function SetupCompleteScreen({ onNext }: { onNext: () => void }) {
  const statuses = [
    { label: 'Identity Verified', icon: BadgeCheck },
    { label: 'Bank Connected', icon: Building2 },
    { label: 'Transaction Sync Enabled', icon: RefreshCcw },
    { label: 'AI Analysis Enabled', icon: BrainCircuit },
    { label: 'Community Lending Ready', icon: Users },
    { label: 'AutoPay Ready', icon: CheckCircle2 },
  ]

  return (
    <div className="flex flex-col space-y-8 items-center text-center">
      <div className="flex justify-center mb-2">
        <OneOrb size={64} />
      </div>

      <div className="space-y-4">
        <h2 className="text-4xl font-serif font-semibold tracking-tight text-primary">
          Setup Complete
        </h2>
        <p className="text-muted-foreground text-lg max-w-md">
          Your ONE ecosystem is fully configured and ready.
        </p>
      </div>

      <div className="bg-card border border-border rounded-3xl p-6 w-full max-w-sm space-y-4 text-left">
        {statuses.map((s, i) => {
          const Icon = s.icon
          return (
            <div key={i} className="flex items-center gap-3 text-foreground font-medium">
              <Icon className="size-5 text-primary" />
              {s.label}
            </div>
          )
        })}
      </div>

      <div className="pt-6 w-full max-w-sm">
        <button
          onClick={onNext}
          className="flex items-center justify-center gap-2 w-full rounded-full bg-primary px-6 py-4 text-base font-medium text-primary-foreground transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_40px_-10px_rgba(40,60,45,0.8)]"
        >
          Go To Dashboard
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  )
}
