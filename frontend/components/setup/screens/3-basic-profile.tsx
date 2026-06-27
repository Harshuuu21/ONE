'use client'

import { useState } from 'react'
import { ArrowRight, Mail, Phone, User, Calendar } from 'lucide-react'

export function BasicProfileScreen({ onNext }: { onNext: () => void }) {
  const [loading, setLoading] = useState(false)

  const handleContinue = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onNext()
    }, 600)
  }

  return (
    <div className="flex flex-col space-y-8">
      <div className="space-y-4 text-center">
        <h2 className="text-3xl font-serif font-semibold tracking-tight">
          Basic Profile
        </h2>
        <p className="text-muted-foreground text-lg">
          Just a few details to set up your identity.
        </p>
      </div>

      <div className="space-y-4 max-w-md mx-auto w-full">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground ml-1">Full Name</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="e.g. Maya Sharma"
              className="w-full rounded-2xl border border-border bg-card pl-12 pr-4 py-4 text-base outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground ml-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-primary" />
            <input 
              type="email" 
              defaultValue="maya@example.com"
              disabled
              className="w-full rounded-2xl border border-border bg-secondary/50 pl-12 pr-4 py-4 text-base text-muted-foreground cursor-not-allowed outline-none"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-md">Verified</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground ml-1">Mobile Number</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-primary" />
            <input 
              type="tel" 
              defaultValue="+91 98765 43210"
              disabled
              className="w-full rounded-2xl border border-border bg-secondary/50 pl-12 pr-4 py-4 text-base text-muted-foreground cursor-not-allowed outline-none"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-md">Verified</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground ml-1">Date of Birth</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
            <input 
              type="date" 
              className="w-full rounded-2xl border border-border bg-card pl-12 pr-4 py-4 text-base outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="pt-6">
        <button
          onClick={handleContinue}
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full max-w-sm mx-auto rounded-full bg-primary px-6 py-4 text-base font-medium text-primary-foreground transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
        >
          {loading ? 'Saving...' : 'Continue'}
          {!loading && <ArrowRight className="size-4" />}
        </button>
      </div>
    </div>
  )
}
