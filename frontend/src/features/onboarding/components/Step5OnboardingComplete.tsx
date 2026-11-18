'use client';

import React from 'react';
import { FinancialProfile } from '../types';
import { Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { OneOrb } from '@/components/common/one-mark';

interface Props {
  profile: FinancialProfile;
  onSubmit: () => void;
  loading: boolean;
}

export function Step5OnboardingComplete({ profile, onSubmit, loading }: Props) {
  return (
    <div className="space-y-6 text-center max-w-xl mx-auto py-2">
      <div className="flex justify-center">
        <div className="relative">
          <OneOrb size={64} />
          <div className="absolute -bottom-1 -right-1 bg-[#077A7D] text-white p-1 rounded-full shadow-lg">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-serif text-white tracking-tight">
          Your Financial Identity is Ready
        </h2>
        <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">
          ONE's personalization engine has structured your financial environment based on your real-world profile.
        </p>
      </div>

      {/* Summary Review Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
        <div className="p-3.5 rounded-xl border border-white/10 bg-white/[0.03]">
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
            Professional Profile
          </p>
          <p className="text-sm font-semibold text-white mt-1 capitalize">
            {profile.occupation.replace(/_/g, ' ').toLowerCase()}
          </p>
          {profile.occupationDetails && (
            <p className="text-xs text-[#077A7D] mt-0.5">{profile.occupationDetails}</p>
          )}
        </div>

        <div className="p-3.5 rounded-xl border border-white/10 bg-white/[0.03]">
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
            Inflow Calibration
          </p>
          <p className="text-sm font-semibold text-white mt-1">
            {profile.incomeSource || 'Regular Inflow'}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            {profile.incomeFrequency ? `${profile.incomeFrequency.toLowerCase()} frequency` : 'Monthly'}
          </p>
        </div>

        <div className="p-3.5 rounded-xl border border-white/10 bg-white/[0.03]">
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
            Target Goals
          </p>
          <p className="text-sm font-semibold text-white mt-1">
            {(profile.financialGoals || []).length} Goals Selected
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            Proportional surplus allocation active
          </p>
        </div>

        <div className="p-3.5 rounded-xl border border-white/10 bg-white/[0.03]">
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
            Topic Alignment
          </p>
          <p className="text-sm font-semibold text-white mt-1">
            {(profile.interests || []).length} Topics of Focus
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            AI briefings & community curation
          </p>
        </div>
      </div>

      <div className="p-3 rounded-xl border border-[#077A7D]/30 bg-[#077A7D]/10 text-xs text-slate-300 flex items-center gap-2.5 text-left">
        <Sparkles className="w-4 h-4 text-[#077A7D] shrink-0" />
        <span>
          Clicking below will initialize your dynamic financial ledger, transactions, and community feed with complete idempotency.
        </span>
      </div>

      {/* Primary Action Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onSubmit}
          disabled={loading}
          className="w-full py-3.5 px-6 rounded-xl bg-[#077A7D] hover:bg-[#077A7D]/90 text-white font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(7,122,125,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Configuring Financial OS...</span>
            </>
          ) : (
            <>
              <span>Enter ONE Financial Assistant</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

