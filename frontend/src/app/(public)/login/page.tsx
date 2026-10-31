'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react'
import { AuthService } from '@/services/auth.service'
import { OneOrb } from '@/components/one-mark'
import Link from 'next/link'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      await AuthService.login(email, password)
      router.push('/dashboard') // Redirect to Dashboard on success
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grain flex min-h-[100svh] w-full flex-col items-center justify-center p-6 bg-background">
      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center space-y-4 text-center">
          <OneOrb size={48} />
          <div>
            <h1 className="font-serif text-3xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground mt-1">Log in to your ONE account</p>
          </div>
        </div>

        <div className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-destructive/10 p-4 text-sm font-medium text-destructive">
              <AlertCircle className="size-4" />
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
              <input 
                type="email" 
                placeholder="maya@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full rounded-2xl border border-border bg-card pl-12 pr-4 py-4 text-base outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full rounded-2xl border border-border bg-card pl-12 pr-4 py-4 text-base outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full rounded-full bg-primary px-6 py-4 text-base font-medium text-primary-foreground transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
          >
            {loading ? 'Logging in...' : 'Log In'}
            {!loading && <ArrowRight className="size-4" />}
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link href="/setup" className="font-medium text-primary hover:underline">
            Set up ONE
          </Link>
        </p>
      </form>
    </div>
  )
}

