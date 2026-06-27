'use client'

import { motion, AnimatePresence } from 'motion/react'
import { Search, X, TrendingUp, Calendar, Target, Compass } from 'lucide-react'

export function GlobalSearch({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center bg-foreground/40 pt-[15vh] backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-border p-4">
              <Search className="size-5 text-muted-foreground" />
              <input
                autoFocus
                type="text"
                placeholder="Search transactions, goals, trips..."
                className="flex-1 bg-transparent font-medium outline-none placeholder:text-muted-foreground"
              />
              <button onClick={onClose} className="rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground">
                <X className="size-4" />
              </button>
            </div>
            
            <div className="p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Quick Links</p>
              <div className="grid gap-2">
                {[
                  { label: 'Recent Transactions', icon: TrendingUp },
                  { label: 'Japan Trip Budget', icon: Compass },
                  { label: 'Emergency Fund Goal', icon: Target },
                  { label: 'Upcoming Deadlines', icon: Calendar },
                ].map((item, i) => {
                  const Icon = item.icon
                  return (
                    <button key={i} onClick={onClose} className="flex items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-secondary">
                      <div className="flex size-8 items-center justify-center rounded-full bg-background text-primary">
                        <Icon className="size-4" />
                      </div>
                      <span className="font-medium text-sm">{item.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
