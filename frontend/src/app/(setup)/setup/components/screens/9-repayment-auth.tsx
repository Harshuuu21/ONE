'use client'

import { useState } from 'react'
import { ArrowRight, RefreshCcw, ShieldCheck } from 'lucide-react'
import { AutoPayService } from '@/app/(authenticated)/wallet/services/autopay.service'

export function RepaymentAuthScreen({ onNext }: { onNext: () => void }) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSetup = async () => {
    setLoading(true)
    try {
      const init = await AutoPayService.setupAutoPay('user_123', 'upi_autopay')
      await AutoPayService.verifyMandate('user_123', init.orderId)
      setSuccess(true)
      setTimeout(() => {
        onNext()
      }, 1500)
    } catch (e) {
      console.error(e)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col space-y-6 items-center text-center">
        <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
          <ShieldCheck className="size-10" />
        </div>
        <h2 className="text-3xl font-serif font-semibold tracking-tight">AutoPay Configured</h2>
        <p className="text-muted-foreground text-lg max-w-sm">Your repayment authorization is active and secure.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col space-y-8">
      <div className="space-y-4 text-center max-w-md mx-auto">
        <h2 className="text-3xl font-serif font-semibold tracking-tight">
          Repayment Authorization
        </h2>
        <p className="text-muted-foreground text-base">
          Before borrowing money you must authorize automatic repayments.
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 text-center max-w-sm mx-auto w-full space-y-4 shadow-sm">
        <RefreshCcw className="size-10 text-primary mx-auto mb-2" />
        <p className="text-sm font-medium text-foreground">
          The authorization will be completed using:
        </p>
        <div className="flex items-center justify-center gap-4 text-lg font-semibold font-serif text-primary">
          <span>UPI AutoPay</span>
          <span className="text-muted-foreground/40 font-sans text-sm">or</span>
          <span>eMandate</span>
        </div>
      </div>

      <div className="bg-secondary/50 text-foreground/80 rounded-2xl p-5 text-sm font-medium max-w-md mx-auto w-full italic">
        "I authorize ONE to initiate repayments for loans that I voluntarily accept using my approved AutoPay/eMandate."
      </div>

      <div className="pt-4 flex flex-col gap-3 items-center w-full max-w-sm mx-auto">
        <button
          onClick={handleSetup}
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full rounded-full bg-primary px-6 py-4 text-base font-medium text-primary-foreground transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? 'Setting up AutoPay...' : 'Setup AutoPay'}
          {!loading && <ArrowRight className="size-4" />}
        </button>
      </div>
    </div>
  )
}
