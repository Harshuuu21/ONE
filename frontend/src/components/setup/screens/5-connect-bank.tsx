'use client'

import { useState } from 'react'
import { ArrowRight, ArrowDown, Building2, ShieldCheck, Cpu } from 'lucide-react'
import { AccountAggregatorService } from '@/lib/services/account-aggregator.service'

export function ConnectBankScreen({ onNext }: { onNext: () => void }) {
  const [loading, setLoading] = useState(false)
  const [connected, setConnected] = useState(false)

  const handleConnect = async () => {
    setLoading(true)
    try {
      const init = await AccountAggregatorService.initializeConnection('user_123')
      // Simulate opening AA modal and returning
      await AccountAggregatorService.verifyConnection('user_123', init.sessionId)
      setConnected(true)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (connected) {
    return (
      <div className="flex flex-col space-y-8 items-center text-center">
        <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
          <ShieldCheck className="size-10" />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-3xl font-serif font-semibold tracking-tight">
            Bank Connected Successfully
          </h2>
          <div className="bg-card border border-border rounded-2xl p-6 text-left space-y-4 max-w-sm mx-auto w-full">
            <div className="flex justify-between items-center pb-4 border-b border-border/50">
              <span className="text-muted-foreground text-sm">Primary Account</span>
              <span className="font-semibold text-foreground">XXXXXXXX1234</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-sm">Status</span>
              <span className="text-primary text-sm font-medium bg-primary/10 px-2 py-1 rounded-md">Verified</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-sm">Transaction Sync</span>
              <span className="text-foreground text-sm font-medium">Enabled</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-sm">AI Insights</span>
              <span className="text-foreground text-sm font-medium">Enabled</span>
            </div>
          </div>
        </div>

        <div className="pt-6 w-full max-w-sm">
          <button
            onClick={onNext}
            className="flex items-center justify-center gap-2 w-full rounded-full bg-primary px-6 py-4 text-base font-medium text-primary-foreground transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Continue
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col space-y-8 text-center">
      <div className="space-y-4">
        <h2 className="text-3xl font-serif font-semibold tracking-tight">
          Securely Connect Your Bank
        </h2>
        <p className="text-muted-foreground text-base max-w-md mx-auto">
          ONE securely connects through India's Account Aggregator framework. You explicitly approve data sharing.
        </p>
      </div>

      <div className="bg-destructive/5 text-destructive rounded-2xl p-4 text-sm font-medium max-w-md mx-auto w-full">
        We NEVER ask for your Internet Banking Password, Debit Card PIN, UPI PIN, or Banking OTP.
      </div>

      {/* Flow Diagram */}
      <div className="flex flex-col items-center gap-2 py-4 text-muted-foreground text-sm font-medium">
        <div className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-xl text-foreground"><Cpu className="size-4"/> ONE AI</div>
        <ArrowDown className="size-4" />
        <div className="bg-background border border-border px-4 py-2 rounded-xl">Requests Consent</div>
        <ArrowDown className="size-4" />
        <div className="bg-background border border-border px-4 py-2 rounded-xl">Account Aggregator</div>
        <ArrowDown className="size-4" />
        <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-xl"><Building2 className="size-4"/> Bank</div>
        <ArrowDown className="size-4" />
        <div className="bg-background border border-border px-4 py-2 rounded-xl">Encrypted Financial Data</div>
      </div>

      <div className="pt-2">
        <button
          onClick={handleConnect}
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full max-w-sm mx-auto rounded-full bg-primary px-6 py-4 text-base font-medium text-primary-foreground transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? 'Initializing Account Aggregator...' : 'Connect Bank Account'}
          {!loading && <ArrowRight className="size-4" />}
        </button>
      </div>
    </div>
  )
}
