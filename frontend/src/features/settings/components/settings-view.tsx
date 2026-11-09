'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Settings,
  Shield,
  Moon,
  Bell,
  CreditCard,
  User,
  Database,
  CheckCircle2,
  ChevronRight,
  LogOut,
  Fingerprint,
  Smartphone,
  Key,
  Sparkles,
} from 'lucide-react';
import { SceneHeader } from '@/components/common/scene-header';
import { AuthService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import { ConnectedBanksSettings } from './ConnectedBanksSettings';
import { DemoDataSettings } from './DemoDataSettings';
import { PasskeyApi } from '@/features/authentication/services/passkeyApi';

export function SettingsView() {
  const [activeTab, setActiveTab] = useState('Account');
  const [passkeyLoading, setPasskeyLoading] = useState(false);
  const [passkeyMessage, setPasskeyMessage] = useState<string | null>(null);
  const router = useRouter();

  const user = AuthService.getStoredUser();

  const TABS = [
    { label: 'Account', icon: User, desc: 'Manage your profile and credentials' },
    { label: 'Connections', icon: CreditCard, desc: 'Connected bank accounts & balances' },
    { label: 'Demo Data', icon: Sparkles, desc: 'Personalized demo data engine and simulation reset' },
    { label: 'Permissions & Data', icon: Database, desc: 'ReBIT AA consent records and data controls' },
    { label: 'Security', icon: Shield, desc: 'Passkeys, biometrics and session security' },
    { label: 'Preferences', icon: Moon, desc: 'Appearance and interface settings' },
    { label: 'Notifications', icon: Bell, desc: 'Alerts, briefings, and reminders' },
  ];

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      router.push('/login');
    } catch (e) {
      console.error(e);
      router.push('/login');
    }
  };

  const handleRegisterPasskey = async () => {
    setPasskeyLoading(true);
    setPasskeyMessage(null);
    try {
      const res = await PasskeyApi.registerPasskey('This Device');
      setPasskeyMessage('Passkey registered successfully! You can now sign in with biometric authentication.');
    } catch (err: any) {
      setPasskeyMessage(err.message || 'Passkey registration cancelled or failed');
    } finally {
      setPasskeyLoading(false);
    }
  };

  return (
    <div className="pb-24">
      <SceneHeader
        eyebrow="Preferences & Privacy"
        title="Settings & Controls"
        subtitle="Full transparency and control over your ONE operating system."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Navigation Sidebar */}
        <div className="flex flex-col gap-2 rounded-3xl border border-border bg-card p-4 h-fit">
          <div className="mb-2 px-3 pt-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Categories</p>
          </div>
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.label;
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
            );
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
                  <p className="mt-1 font-medium">{user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Harsh Bajaj' : 'Harsh Bajaj'}</p>
                </div>
                <div className="rounded-2xl border border-border p-4 bg-background">
                  <p className="text-xs text-muted-foreground">Mobile Number</p>
                  <p className="mt-1 font-medium font-mono">{user?.mobileNumber || '+91 98765 43210'}</p>
                </div>
                <div className="rounded-2xl border border-border p-4 bg-background">
                  <p className="text-xs text-muted-foreground">Reputation Score</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-serif text-xl font-semibold text-primary">{user?.reputationScore || 780}</span>
                    <span className="text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full font-medium">
                      {user?.reputationTitle || 'Tier 1'}
                    </span>
                  </div>
                </div>
                <div className="rounded-2xl border border-border p-4 bg-background">
                  <p className="text-xs text-muted-foreground">Account Status</p>
                  <div className="flex items-center gap-1.5 mt-1 text-sm font-medium text-emerald-500">
                    <CheckCircle2 className="size-4" /> Phone OTP &amp; AA Verified
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {(activeTab === 'Connections' || activeTab === 'Permissions & Data') && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <ConnectedBanksSettings />
            </motion.div>
          )}

          {activeTab === 'Demo Data' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <DemoDataSettings />
            </motion.div>
          )}

          {activeTab === 'Security' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div>
                <h3 className="font-serif text-2xl font-medium">Authentication &amp; Passkeys</h3>
                <p className="text-sm text-muted-foreground mt-1">Manage biometric sign-in and active devices</p>
              </div>

              {passkeyMessage && (
                <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-xs text-primary">
                  {passkeyMessage}
                </div>
              )}

              <div className="rounded-2xl border border-border p-6 bg-background space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-11 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                      <Fingerprint className="size-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-foreground">FIDO2 / WebAuthn Passkeys</h4>
                      <p className="text-xs text-muted-foreground">Sign in instantly with Face ID, Touch ID, or Windows Hello</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRegisterPasskey}
                    disabled={passkeyLoading}
                    className="px-4 py-2 rounded-xl bg-primary text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
                  >
                    {passkeyLoading ? 'Prompting Biometrics...' : 'Register New Device'}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Security Protections Active
                </h4>
                <div className="grid gap-3 sm:grid-cols-2 text-xs">
                  <div className="p-4 rounded-2xl border border-border bg-background flex items-center gap-3">
                    <Smartphone className="size-5 text-emerald-400" />
                    <div>
                      <p className="font-medium text-foreground">Verified Phone Binding</p>
                      <p className="text-muted-foreground text-[11px]">Bound to +91 Indian AA network</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl border border-border bg-background flex items-center gap-3">
                    <Key className="size-5 text-emerald-400" />
                    <div>
                      <p className="font-medium text-foreground">Rotating Refresh Tokens</p>
                      <p className="text-muted-foreground text-[11px]">Strict HTTP-only session cookies</p>
                    </div>
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
                <div className="flex items-center justify-between rounded-2xl border border-border p-4 bg-background">
                  <div>
                    <p className="font-medium text-sm">Theme Mode</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Dark fintech theme (high contrast)</p>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-secondary">Dark Mode</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-border p-4 bg-background">
                  <div>
                    <p className="font-medium text-sm">Currency Display</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Primary currency for accounts &amp; analytics</p>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-secondary">INR (₹)</span>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'Notifications' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div>
                <h3 className="font-serif text-2xl font-medium">Notification Preferences</h3>
                <p className="text-sm text-muted-foreground mt-1">Configure automated briefings and balance alerts</p>
              </div>
              <div className="rounded-2xl border border-dashed border-border p-8 text-center bg-background/50">
                <CheckCircle2 className="mx-auto size-8 text-primary mb-2" />
                <p className="text-sm font-medium">Real-time alerts active for all linked bank accounts</p>
                <p className="text-xs text-muted-foreground mt-1">Automated daily balance digests and anomaly detection</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
