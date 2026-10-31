'use client'

import { ArrowRight, CheckCircle2, Circle } from 'lucide-react'

export function CommunityLendingScreen({ onNext }: { onNext: () => void }) {
  const requirements = [
    { name: 'Verified Identity', status: 'completed' },
    { name: 'Verified Bank Account', status: 'completed' },
    { name: 'Digital Loan Agreement', status: 'incomplete' },
    { name: 'AutoPay / eMandate', status: 'incomplete' },
  ]

  return (
    <div className="flex flex-col space-y-8">
      <div className="space-y-4 text-center max-w-md mx-auto">
        <h2 className="text-3xl font-serif font-semibold tracking-tight">
          Community Lending Setup
        </h2>
        <p className="text-muted-foreground text-base">
          Community Lending requires additional verification to protect all members.
        </p>
      </div>

      <div className="space-y-3 max-w-sm mx-auto w-full">
        {requirements.map((req, i) => (
          <div key={i} className={`flex items-center justify-between p-4 rounded-xl border ${req.status === 'completed' ? 'bg-primary/5 border-primary/20' : 'bg-card border-border'}`}>
            <span className={`font-medium ${req.status === 'completed' ? 'text-foreground' : 'text-muted-foreground'}`}>{req.name}</span>
            {req.status === 'completed' ? (
              <CheckCircle2 className="size-5 text-primary" />
            ) : (
              <Circle className="size-5 text-border" />
            )}
          </div>
        ))}
      </div>

      <div className="pt-6 w-full max-w-sm mx-auto">
        <button
          onClick={onNext}
          className="flex items-center justify-center gap-2 w-full rounded-full bg-primary px-6 py-4 text-base font-medium text-primary-foreground transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          Complete Setup
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  )
}
