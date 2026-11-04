'use client'

import { OneOrb } from '@/components/common/one-mark'
import { ArrowRight, ShieldCheck } from 'lucide-react'

export function WelcomeScreen({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col items-center text-center space-y-8">
      <div className="flex justify-center mb-4">
        <OneOrb size={64} />
      </div>
      
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-serif font-semibold tracking-tight">
          Welcome to ONE
        </h1>
        <p className="text-xl text-muted-foreground font-medium">
          Your AI-Powered Financial Assistant
        </p>
      </div>

      <div className="pt-8 flex flex-col gap-4 w-full max-w-sm">
        <button
          onClick={onNext}
          className="flex items-center justify-center gap-2 w-full rounded-full bg-primary px-6 py-4 text-base font-medium text-primary-foreground transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          Continue
          <ArrowRight className="size-4" />
        </button>
        
        <button
          onClick={onNext}
          className="flex items-center justify-center gap-2 w-full rounded-full border border-border bg-background px-6 py-4 text-sm font-medium text-muted-foreground transition-all hover:bg-secondary hover:text-foreground"
        >
          <ShieldCheck className="size-4" />
          Learn How We Protect Your Data
        </button>
      </div>
    </div>
  )
}
