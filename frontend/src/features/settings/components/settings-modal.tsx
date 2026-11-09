'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Settings, X, Shield, Moon, Bell, CreditCard, User, Database, Building2, Sparkles } from 'lucide-react'
import { DemoDataSettings } from './DemoDataSettings'

export function SettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState('Account')
  
  const TABS = [
    { label: 'Account', icon: User },
    { label: 'Demo Data', icon: Sparkles },
    { label: 'Preferences', icon: Moon },
    { label: 'Notifications', icon: Bell },
    { label: 'Security', icon: Shield },
    { label: 'Connections', icon: CreditCard },
    { label: 'Permissions & Data', icon: Database },
  ]

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
                {TABS.map((item, i) => {
                  const Icon = item.icon
                  const isActive = activeTab === item.label
                  return (
                    <button 
                      key={i} 
                      onClick={() => setActiveTab(item.label)}
                      className={`flex items-center gap-3 rounded-xl p-3 text-sm font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
                    >
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
                <h3 className="font-medium">{activeTab} Overview</h3>
                <button onClick={onClose} className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground">
                  <X className="size-4" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'Account' && (
                  <div className="space-y-6">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Name</label>
                      <input type="text" defaultValue="Maya" className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Email</label>
                      <input type="email" defaultValue="maya@example.com" className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Session & Access</p>
                      <button 
                        onClick={async () => {
                          const { AuthService } = await import('@/services/auth.service');
                          await AuthService.logout();
                          window.location.href = '/login';
                        }}
                        className="mt-2 mr-2 rounded-xl border border-primary bg-primary/5 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                      >
                        Log Out
                      </button>
                      <button className="mt-2 rounded-xl border border-destructive bg-destructive/5 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground">
                        Delete Account
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'Permissions & Data' && (
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold">Connected Bank</h4>
                      <div className="bg-background border border-border p-4 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 text-primary rounded-xl">
                            <Building2 className="size-5" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">HDFC Bank</p>
                            <p className="text-xs text-muted-foreground">XXXXXXXX1234 • Verified via Account Aggregator</p>
                          </div>
                        </div>
                        <button className="text-xs font-medium text-destructive hover:underline">
                          Disconnect
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold">AI Consent</h4>
                      <div className="bg-background border border-border p-4 rounded-2xl flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Financial Data Analysis</p>
                          <p className="text-xs text-muted-foreground max-w-[280px]">Allows ONE to analyze your data for budgeting, insights, and fraud detection.</p>
                        </div>
                        <button className="text-xs font-medium text-destructive hover:underline">
                          Revoke Access
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold">Granted Permissions</h4>
                      <div className="bg-background border border-border rounded-2xl overflow-hidden divide-y divide-border text-sm">
                        {['Transaction History', 'Account Balance', 'Monthly Statements', 'Income Credits'].map((perm, i) => (
                          <div key={i} className="flex items-center justify-between p-3 px-4">
                            <span>{perm}</span>
                            <span className="text-primary font-medium bg-primary/10 px-2 py-0.5 rounded text-xs">Active</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold">Consent History</h4>
                      <div className="text-xs text-muted-foreground space-y-2 pl-1 border-l-2 border-border ml-2">
                        <p>• Connected HDFC Bank via AA (Oct 21, 2023)</p>
                        <p>• Granted AI Analysis Consent (Oct 21, 2023)</p>
                        <p>• Completed Identity Verification (Oct 21, 2023)</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'Demo Data' && (
                  <DemoDataSettings />
                )}

                {activeTab !== 'Account' && activeTab !== 'Demo Data' && activeTab !== 'Permissions & Data' && (
                  <div className="text-sm text-muted-foreground">
                    Settings for {activeTab} will appear here.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
