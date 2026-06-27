'use client'

import { useState } from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'
import { ConsentService } from '@/lib/services/consent.service'
import { OneOrb } from '@/components/one-mark'

export function AiConsentScreen({ onNext }: { onNext: () => void }) {
  const [loading, setLoading] = useState(false)

  const handleConsent = async () => {
    setLoading(true)
    try {
      await ConsentService.logConsent('user_123', 'AI Analysis of Financial Data', '1.0')
      onNext()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col space-y-8 items-center text-center">
      <div className="flex justify-center mb-2">
        <OneOrb size={56} />
      </div>

      <div className="space-y-4 max-w-md">
        <h2 className="text-3xl font-serif font-semibold tracking-tight">
          AI Consent
        </h2>
        <p className="text-foreground/80 text-lg leading-relaxed">
          Allow ONE AI to analyze your financial information to provide:
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 max-w-md w-full">
        {['Budget Recommendations', 'Cash Flow Prediction', 'Fraud Detection', 'Financial Insights', 'Goal Planning', 'Loan Eligibility'].map((item, i) => (
          <div key={i} className="bg-primary/5 text-primary text-sm font-medium p-3 rounded-xl flex items-center justify-center gap-2">
            <Sparkles className="size-3" />
            {item}
          </div>
        ))}
      </div>

      <div className="pt-6 w-full max-w-sm">
        <button
          onClick={handleConsent}
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full rounded-full bg-primary px-6 py-4 text-base font-medium text-primary-foreground transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20"
        >
          {loading ? 'Confirming...' : 'Allow AI Analysis'}
          {!loading && <ArrowRight className="size-4" />}
        </button>
      </div>
    </div>
  )
}
