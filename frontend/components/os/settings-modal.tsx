'use client'

import { motion, AnimatePresence } from 'motion/react'
import { Settings, X, Shield, Moon, Bell, CreditCard, User } from 'lucide-react'

export function SettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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
            className="w-full max-w-2xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl flex h-[600px] max-h-[80vh]"
          >
            {/* Sidebar */}
            <div className="w-1/3 border-r border-border bg-background p-4 flex flex-col">
              <div className="flex items-center gap-2 font-medium mb-6 px-2 pt-2">
                <Settings className="size-5" />
                <span>Settings</span>
              </div>
              <nav className="flex flex-col gap-1">
                {[
                  { label: 'Account', icon: User, active: true },
                  { label: 'Preferences', icon: Moon },
                  { label: 'Notifications', icon: Bell },
                  { label: 'Security', icon: Shield },
                  { label: 'Connections', icon: CreditCard },
                ].map((item, i) => {
                  const Icon = item.icon
                  return (
                    <button key={i} className={`flex items-center gap-3 rounded-xl p-3 text-sm font-medium transition-colors ${item.active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
                      <Icon className="size-4" />
                      {item.label}
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Content area */}
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between border-b border-border p-4">
                <h3 className="font-medium">Account Overview</h3>
                <button onClick={onClose} className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground">
                  <X className="size-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Name</label>
                  <input type="text" defaultValue="Maya" className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Email</label>
                  <input type="email" defaultValue="maya@example.com" className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Danger Zone</p>
                  <button className="mt-2 rounded-xl border border-destructive bg-destructive/5 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
