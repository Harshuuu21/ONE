'use client'

import { useState } from 'react'
import { ArrowRight, ShieldAlert, BadgeCheck } from 'lucide-react'
import { IdentityVerificationService } from '../../services/identity.service'

export function IdentityVerificationScreen({ onNext }: { onNext: () => void }) {
  const [loading, setLoading] = useState(false)
  const [pan, setPan] = useState('')
  const [aadhaar, setAadhaar] = useState('')

  const handleVerify = async () => {
    if (!pan || !aadhaar) return
    setLoading(true)
    try {
      await IdentityVerificationService.verifyIdentity('user_123', pan, aadhaar)
      onNext()
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col space-y-8">
      <div className="space-y-4 text-center">
        <h2 className="text-3xl font-serif font-semibold tracking-tight">
          Identity Verification
        </h2>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex gap-3 items-start max-w-md mx-auto">
        <ShieldAlert className="size-5 text-primary shrink-0 mt-0.5" />
        <p className="text-sm text-foreground/90 leading-relaxed">
          Identity verification protects lenders and borrowers by reducing fraud. We do not store your raw documents.
        </p>
      </div>

      <div className="space-y-4 max-w-md mx-auto w-full">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground ml-1">PAN Number</label>
          <input 
            type="text" 
            placeholder="ABCDE1234F"
            value={pan}
            onChange={(e) => setPan(e.target.value.toUpperCase())}
            maxLength={10}
            className="w-full rounded-2xl border border-border bg-card px-5 py-4 text-base outline-none focus:border-primary transition-colors uppercase placeholder:normal-case"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground ml-1">Aadhaar Number</label>
          <input 
            type="text" 
            placeholder="XXXX XXXX XXXX"
            value={aadhaar}
            onChange={(e) => setAadhaar(e.target.value)}
            maxLength={14}
            className="w-full rounded-2xl border border-border bg-card px-5 py-4 text-base outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      <div className="pt-6 flex flex-col gap-3 items-center">
        <button
          onClick={handleVerify}
          disabled={loading || pan.length < 10 || aadhaar.length < 12}
          className="flex items-center justify-center gap-2 w-full max-w-sm rounded-full bg-primary px-6 py-4 text-base font-medium text-primary-foreground transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
        >
          {loading ? 'Verifying with UIDAI...' : 'Verify Identity'}
          {!loading && <BadgeCheck className="size-4" />}
        </button>
      </div>
    </div>
  )
}
