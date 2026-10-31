'use client'

import { motion, AnimatePresence } from 'motion/react'
import { Bell, X, Check, Target, Compass, HandHeart } from 'lucide-react'

export function NotificationsPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-0 right-0 top-0 z-50 w-full max-w-sm border-l border-border bg-card shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between border-b border-border p-5">
              <div className="flex items-center gap-2 font-medium">
                <Bell className="size-5" />
                <span>Notifications</span>
              </div>
              <button onClick={onClose} className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground">
                <X className="size-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <div className="grid gap-4">
                <div className="rounded-2xl border border-border bg-background p-4 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                  <div className="flex items-start gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0 mt-0.5">
                      <Target className="size-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Goal on track</p>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">Your Japan Trip is ahead of schedule. Keep saving $420/mo and you will hit it early.</p>
                      <p className="mt-2 text-[10px] text-muted-foreground uppercase">2 hours ago</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-background p-4 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold" />
                  <div className="flex items-start gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-gold/10 text-gold shrink-0 mt-0.5">
                      <Compass className="size-4 text-gold-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Flight prices dropped</p>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">Flights to Tokyo for Apr 2 just dropped by $120. Book now.</p>
                      <p className="mt-2 text-[10px] text-muted-foreground uppercase">5 hours ago</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-background p-4 relative overflow-hidden">
                  <div className="flex items-start gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-secondary text-muted-foreground shrink-0 mt-0.5">
                      <HandHeart className="size-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Loan Repaid</p>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">Daniel R. repaid the $430 loan early. Your trust score went up!</p>
                      <p className="mt-2 text-[10px] text-muted-foreground uppercase">Yesterday</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-border p-4 text-center">
              <button className="text-xs font-medium text-muted-foreground flex items-center justify-center gap-1.5 w-full hover:text-foreground">
                <Check className="size-3" /> Mark all as read
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
