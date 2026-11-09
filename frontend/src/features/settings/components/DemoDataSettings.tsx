'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  RefreshCw,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  Laptop,
  Store,
  CheckCircle2,
  Calendar,
  Layers,
  PiggyBank,
  TrendingDown,
  Users,
} from 'lucide-react';
import { useDemoData } from '@/hooks/useDemoData';
import { UserPersona } from '@/services/demoDataService';
import { ResetDemoDataDialog } from '@/components/demo-data/ResetDemoDataDialog';

const PERSONA_DETAILS: Record<
  UserPersona,
  {
    title: string;
    icon: React.ElementType;
    description: string;
    incomeBand: string;
    features: string[];
  }
> = {
  WORKING_PROFESSIONAL: {
    title: 'Working Professional',
    icon: Briefcase,
    description: 'Corporate net salary, quarterly bonus, urban rent, vehicle loan, lifestyle subscriptions.',
    incomeBand: '₹85,000 – ₹1,85,000 / mo',
    features: ['Auto Loan with Reducing Balance', '6-Month Emergency Runway', 'Tech Wealth Syndicate Community'],
  },
  STUDENT: {
    title: 'Student',
    icon: GraduationCap,
    description: 'Family allowance, research fellowship, campus dining, budget travel, education financing.',
    incomeBand: '₹20,000 – ₹38,000 / mo',
    features: ['HDFC Credila Student Loan', 'MacBook Coding Goal', 'Campus Hackathon Pooling Circle'],
  },
  FREELANCER: {
    title: 'Freelancer / Creator',
    icon: Laptop,
    description: 'Global client retainers, sprint payouts, co-working spaces, advance tax buffer, hardware gear.',
    incomeBand: '₹70,000 – ₹1,60,000 / mo',
    features: ['Axis Equipment Line', 'Advance Tax 2026 Reserve', 'Independent Creators Safety Net'],
  },
  BUSINESS_OWNER: {
    title: 'Business Owner',
    icon: Store,
    description: 'Merchant POS payouts, B2B invoices, bulk inventory orders, commercial lease, payroll reserve.',
    incomeBand: '₹2,00,000 – ₹4,80,000 / mo',
    features: ['Kotak Business Growth Loan', 'Inventory Expansion Goal', 'SME Bulk Buying Alliance'],
  },
};

export function DemoDataSettings() {
  const { status, summary, loading, isResetting, resetDemoData, initializeDemoData } = useDemoData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const currentPersona = summary?.persona || status?.persona || 'WORKING_PROFESSIONAL';
  const personaConfig = PERSONA_DETAILS[currentPersona];

  const handleResetConfirm = async (persona: UserPersona) => {
    await resetDemoData(persona);
    setSuccessMessage(`Successfully generated fresh financial simulation for ${PERSONA_DETAILS[persona].title}.`);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-medium">Dynamic Demo Financial Engine</h3>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                  {status?.status === 'COMPLETED' ? 'Active' : 'Ready'}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Generates realistic personalized Indian transactions, reducing-balance loans, and simulated communities.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsDialogOpen(true)}
            disabled={isResetting}
            className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:opacity-95 disabled:opacity-50 transition-opacity"
          >
            <RefreshCw className={`size-3.5 ${isResetting ? 'animate-spin' : ''}`} />
            <span>Regenerate Dataset</span>
          </button>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Current Active Persona Summary */}
        <div className="mt-6 rounded-2xl border border-border bg-background/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Active Persona
              </span>
              <span className="font-medium text-sm text-foreground">{personaConfig.title}</span>
            </div>
            <span className="text-xs font-medium text-primary">{personaConfig.incomeBand}</span>
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">{personaConfig.description}</p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {personaConfig.features.map((feat) => (
              <span
                key={feat}
                className="rounded-full border border-border bg-secondary/50 px-2.5 py-0.5 text-[11px] text-muted-foreground"
              >
                {feat}
              </span>
            ))}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-border bg-background/30 p-3.5">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Layers className="size-4 text-primary" />
              <span className="text-xs">Transactions</span>
            </div>
            <p className="mt-1 font-serif text-xl font-medium">
              {summary?.metrics.transactionsCount || status?.recordCounts?.transactions || 0}
            </p>
            <span className="text-[10px] text-muted-foreground">over 75 days</span>
          </div>

          <div className="rounded-2xl border border-border bg-background/30 p-3.5">
            <div className="flex items-center gap-2 text-muted-foreground">
              <PiggyBank className="size-4 text-emerald-500" />
              <span className="text-xs">Active Goals</span>
            </div>
            <p className="mt-1 font-serif text-xl font-medium">
              {summary?.metrics.goalsCount || status?.recordCounts?.goals || 0}
            </p>
            <span className="text-[10px] text-muted-foreground">progress tracked</span>
          </div>

          <div className="rounded-2xl border border-border bg-background/30 p-3.5">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingDown className="size-4 text-amber-500" />
              <span className="text-xs">Loans</span>
            </div>
            <p className="mt-1 font-serif text-xl font-medium">
              {summary?.metrics.activeLoansCount || status?.recordCounts?.loans || 0}
            </p>
            <span className="text-[10px] text-muted-foreground">amortized schedule</span>
          </div>

          <div className="rounded-2xl border border-border bg-background/30 p-3.5">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="size-4 text-blue-500" />
              <span className="text-xs">Communities</span>
            </div>
            <p className="mt-1 font-serif text-xl font-medium">
              {summary?.metrics.communitiesCount || status?.recordCounts?.communities || 0}
            </p>
            <span className="text-[10px] text-muted-foreground">simulated pools</span>
          </div>
        </div>

        {/* Data Isolation Guarantee */}
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-border bg-background/40 p-4 text-xs text-muted-foreground">
          <ShieldCheck className="size-4 shrink-0 text-primary mt-0.5" />
          <div className="space-y-1">
            <p className="font-medium text-foreground">Strict Data Isolation Guarantee</p>
            <p>
              Demo data records are strictly flagged with <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">isDemo: true</code>. Resetting or switching personas purges only simulated mock data and will never delete real bank connections, consents, or authentic transactions.
            </p>
          </div>
        </div>
      </div>

      <ResetDemoDataDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirmReset={handleResetConfirm}
        currentPersona={currentPersona}
        isResetting={isResetting}
      />
    </div>
  );
}

