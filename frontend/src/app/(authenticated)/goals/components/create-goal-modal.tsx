'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Target } from 'lucide-react'
import { type Goal } from '@/lib/one-data'

export function CreateGoalModal({ 
  isOpen, 
  onClose,
  onSubmit 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  onSubmit: (goal: Goal) => void;
}) {
  const [title, setTitle] = useState('')
  const [target, setTarget] = useState('')
  const [monthly, setMonthly] = useState('')
  const [tone, setTone] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const targetAmt = parseFloat(target) || 0
    const monthlyAmt = parseFloat(monthly) || 0
    const etaMonths = monthlyAmt > 0 ? Math.ceil(targetAmt / monthlyAmt) : 0

    const newGoal: Goal = {
      id: Math.random().toString(36).slice(2, 9),
      title: title || 'New Goal',
      image: '/placeholder.svg', // generic placeholder
      saved: 0,
      target: targetAmt,
      monthly: monthlyAmt,
      etaMonths,
      tone: tone || 'Looking forward to it',
    }

    onSubmit(newGoal)
    
    // reset form
    setTitle('')
    setTarget('')
    setMonthly('')
    setTone('')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between border-b border-border p-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 text-primary rounded-xl">
                  <Target className="size-5" />
                </div>
                <h3 className="font-serif text-xl font-medium">Dream up a new goal</h3>
              </div>
              <button onClick={onClose} className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground">
                <X className="size-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="text-xs font-medium text-muted-foreground">What are you saving for?</label>
                <input 
                  type="text" 
                  placeholder="e.g. Japan Trip" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" 
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Target Amount ($)</label>
                  <input 
                    type="number" 
                    placeholder="5000" 
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" 
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Monthly Save ($)</label>
                  <input 
                    type="number" 
                    placeholder="250" 
                    value={monthly}
                    onChange={(e) => setMonthly(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" 
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Set the tone (Subtitle)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Spring cherry blossoms in Kyoto" 
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" 
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  className="w-full rounded-full bg-primary py-3.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
