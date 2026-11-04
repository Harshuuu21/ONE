'use client'

import { useState } from 'react'
import { ArrowRight, ToggleLeft, ToggleRight } from 'lucide-react'
import { ConsentService } from '../../services/consent.service'

const PRIVACY_SETTINGS = [
  { id: 'financialInsights', name: 'Financial Insights', defaultState: true },
  { id: 'transactionTracking', name: 'Transaction Tracking', defaultState: true },
  { id: 'investmentTracking', name: 'Investment Tracking', defaultState: true },
  { id: 'loanTracking', name: 'Loan Tracking', defaultState: true },
  { id: 'incomeAnalysis', name: 'Income Analysis', defaultState: true },
  { id: 'aiSpendingAnalysis', name: 'AI Spending Analysis', defaultState: true },
  { id: 'marketingEmails', name: 'Marketing Emails', defaultState: false },
]

export function PrivacyControlsScreen({ onNext }: { onNext: () => void }) {
  const [loading, setLoading] = useState(false)
  const [preferences, setPreferences] = useState<Record<string, boolean>>(
    Object.fromEntries(PRIVACY_SETTINGS.map(s => [s.id, s.defaultState]))
  )

  const toggle = (id: string) => {
    setPreferences(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await ConsentService.updatePrivacyPreferences('user_123', preferences)
      onNext()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="space-y-4 text-center max-w-md mx-auto">
        <h2 className="text-3xl font-serif font-semibold tracking-tight">
          Privacy Controls
        </h2>
        <p className="text-muted-foreground text-base">
          You are in control. These settings can be edited later from the Settings menu.
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-2 divide-y divide-border max-w-sm mx-auto w-full">
        {PRIVACY_SETTINGS.map((setting) => (
          <div key={setting.id} className="flex items-center justify-between p-3">
            <span className="font-medium text-foreground text-sm">{setting.name}</span>
            <button onClick={() => toggle(setting.id)} className="text-primary transition-colors hover:text-primary/80">
              {preferences[setting.id] ? (
                <ToggleRight className="size-8" strokeWidth={1.5} />
              ) : (
                <ToggleLeft className="size-8 text-muted-foreground" strokeWidth={1.5} />
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="pt-4 w-full max-w-sm mx-auto">
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full rounded-full bg-primary px-6 py-4 text-base font-medium text-primary-foreground transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          {loading ? 'Saving Preferences...' : 'Save & Continue'}
          {!loading && <ArrowRight className="size-4" />}
        </button>
      </div>
    </div>
  )
}
