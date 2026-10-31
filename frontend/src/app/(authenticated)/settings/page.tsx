'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { Settings, Shield, Moon, Bell, CreditCard, User, Database, CheckCircle2, ChevronRight, LogOut } from 'lucide-react'
import { SceneHeader } from '@/components/os/scene-header'
import { AuthService } from '@/services/auth.service'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Account')
  const router = useRouter()

  const TABS = [
    { label: 'Account', icon: User, desc: 'Manage your profile and credentials' },
    { label: 'Preferences', icon: Moon, desc: 'Appearance and interface settings' },
    { label: 'Notifications', icon: Bell, desc: 'Alerts, briefings, and reminders' },
    { label: 'Security', icon: Shield, desc: 'Authentication and session security' },
    { label: 'Connections', icon: CreditCard, desc: 'Connected bank accounts and cards' },
    { label: 'Permissions & Data', icon: Database, desc: 'Consent records and data controls' },
  ]

  const handleLogout = async () => {
    try {
      await AuthService.logout()
      router.push('/login')
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="pb-24">
      <SceneHeader
        eyebrow="Preferences & Privacy"
        title="Settings & Controls"
        subtitle="Full transparency and control over your ONE operating system."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Navigation Sidebar */}
        <div className="flex flex-col gap-2 rounded-3xl border border-border bg-card p-4">
          <div className="mb-2 px-3 pt-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Categories</p>
          </div>
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.label
            return (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="size-4" />
                  <span>{tab.label}</span>
                </div>
                <ChevronRight className={`size-4 transition-transform ${isActive ? 'rotate-90' : 'opacity-40'}`} />
              </button>
            )
          })}

          <div className="mt-6 border-t border-border pt-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
            >
              <LogOut className="size-4" />
              <span>Log out</span>
            </button>
          </div>
        </div>

        {/* Content Pane */}
        <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
          {activeTab === 'Account' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div>
                <h3 className="font-serif text-2xl font-medium">Account Details</h3>
                <p className="text-sm text-muted-foreground mt-1">Your identity and profile on ONE</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-border p-4 bg-background">
                  <p className="text-xs text-muted-foreground">Full Name</p>
                  <p className="mt-1 font-medium">Maya Lin</p>
                </div>
                <div className="rounded-2xl border border-border p-4 bg-background">
                  <p className="text-xs text-muted-foreground">Email Address</p>
                  <p className="mt-1 font-medium">maya@example.com</p>
                </div>
                <div className="rounded-2xl border border-border p-4 bg-background">
                  <p className="text-xs text-muted-foreground">Reputation Score</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-serif text-xl font-semibold text-primary">820</span>
                    <span className="text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full font-medium">Tier 1</span>
                  </div>
                </div>
                <div className="rounded-2xl border border-border p-4 bg-background">
                  <p className="text-xs text-muted-foreground">Account Status</p>
                  <div className="flex items-center gap-1.5 mt-1 text-sm font-medium text-emerald-600">
                    <CheckCircle2 className="size-4" /> Verified & Active
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'Preferences' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div>
                <h3 className="font-serif text-2xl font-medium">System Preferences</h3>
                <p className="text-sm text-muted-foreground mt-1">Customize your interaction experience</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-2xl border border-border p-4">
                  <div>
                    <p className="font-medium text-sm">Theme Mode</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Adapt to system settings automatically</p>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-secondary">System</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-border p-4">
                  <div>
                    <p className="font-medium text-sm">Currency Display</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Primary currency for budgets and reports</p>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-secondary">USD ($)</span>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab !== 'Account' && activeTab !== 'Preferences' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div>
                <h3 className="font-serif text-2xl font-medium">{activeTab}</h3>
                <p className="text-sm text-muted-foreground mt-1">Configure your {activeTab.toLowerCase()} options</p>
              </div>
              <div className="rounded-2xl border border-dashed border-border p-8 text-center bg-background/50">
                <CheckCircle2 className="mx-auto size-8 text-primary mb-2" />
                <p className="text-sm font-medium">{activeTab} controls active and calibrated</p>
                <p className="text-xs text-muted-foreground mt-1">Managed automatically by ONE AI Operating System</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

