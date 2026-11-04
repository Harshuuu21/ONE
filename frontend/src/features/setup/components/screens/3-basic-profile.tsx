'use client'

import { useState } from 'react'
import { ArrowRight, Mail, User, AlertCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export function BasicProfileScreen({ onNext }: { onNext: () => void }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [name, setName] = useState(user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : '')
  const [email, setEmail] = useState('')

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!name.trim()) {
      setError('Please enter your full name')
      return
    }

    setLoading(true)
    try {
      // In the new flow, mobile number is already verified
      onNext()
    } catch (err: any) {
      console.error('Profile setup error:', err)
      setError(err.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleProfileSave} className="flex flex-col space-y-8">
      <div className="space-y-4 text-center">
        <h2 className="text-3xl font-serif font-semibold tracking-tight">
          Personalize Your Profile
        </h2>
        <p className="text-muted-foreground text-lg">
          Tell us how you would like your financial copilot to address you.
        </p>
      </div>

      <div className="space-y-4 max-w-md mx-auto w-full">
        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-destructive/10 p-4 text-sm font-medium text-destructive">
            <AlertCircle className="size-4" />
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground ml-1">Full Name</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="e.g. Maya Sharma"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full rounded-2xl border border-border bg-card pl-12 pr-4 py-4 text-base outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground ml-1">Email (Optional)</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
            <input 
              type="email" 
              placeholder="maya@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-border bg-card pl-12 pr-4 py-4 text-base outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="pt-6">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full max-w-sm mx-auto rounded-full bg-primary px-6 py-4 text-base font-medium text-primary-foreground transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
        >
          {loading ? 'Saving...' : 'Continue'}
          {!loading && <ArrowRight className="size-4" />}
        </button>
      </div>
    </form>
  )
}
