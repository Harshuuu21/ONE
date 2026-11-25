'use client';

import React, { useState, useEffect } from 'react';
import { FinancialProfile, GoalItem, OccupationType } from '@/features/onboarding/types';
import { FinancialIdentityApi } from '@/features/onboarding/services/financialIdentityApi';
import { DemoDataService } from '@/services/demoDataService';
import {
  UserCheck,
  Briefcase,
  Target,
  BookOpen,
  RefreshCw,
  Save,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Plus,
  Trash2,
} from 'lucide-react';

export function FinancialProfileSettings() {
  const [profile, setProfile] = useState<FinancialProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [showRegenPrompt, setShowRegenPrompt] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form State
  const [occupation, setOccupation] = useState<OccupationType>('WORKING_PROFESSIONAL');
  const [occupationDetails, setOccupationDetails] = useState('');
  const [incomeSource, setIncomeSource] = useState('');
  const [monthlyIncomeRange, setMonthlyIncomeRange] = useState('');
  const [goals, setGoals] = useState<GoalItem[]>([]);
  const [interests, setInterests] = useState<string[]>([]);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await FinancialIdentityApi.getProfile();
        setProfile(data);
        setOccupation(data.occupation || 'WORKING_PROFESSIONAL');
        setOccupationDetails(data.occupationDetails || '');
        setIncomeSource(data.incomeSource || '');
        setMonthlyIncomeRange(data.monthlyIncomeRange || '');
        setGoals(data.financialGoals || []);
        setInterests(data.interests || []);
      } catch (err: any) {
        setFeedback({ type: 'error', message: err.message || 'Failed to load profile' });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSaveClick = (e: React.FormEvent) => {
    e.preventDefault();
    setShowRegenPrompt(true);
  };

  const executeSave = async (shouldRegenerateDemoData: boolean) => {
    setShowRegenPrompt(false);
    setSaving(true);
    setFeedback(null);

    const updatedProfile: Partial<FinancialProfile> = {
      occupation,
      occupationDetails,
      incomeSource,
      monthlyIncomeRange,
      financialGoals: goals,
      interests,
    };

    try {
      const res = await FinancialIdentityApi.updateProfile(updatedProfile);
      setProfile((prev) => (prev ? { ...prev, ...res } : (res as FinancialProfile)));

      if (shouldRegenerateDemoData) {
        setRegenerating(true);
        let mappedPersona: any = 'WORKING_PROFESSIONAL';
        if (occupation === 'STUDENT') mappedPersona = 'STUDENT';
        else if (occupation === 'FREELANCER') mappedPersona = 'FREELANCER';
        else if (occupation === 'BUSINESS_OWNER' || occupation === 'ENTREPRENEUR') mappedPersona = 'BUSINESS_OWNER';

        await DemoDataService.reset(mappedPersona);
        setFeedback({
          type: 'success',
          message: 'Financial profile saved and demo dataset successfully regenerated!',
        });
      } else {
        setFeedback({
          type: 'success',
          message: 'Financial profile updated successfully.',
        });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to save financial profile.' });
    } finally {
      setSaving(false);
      setRegenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-6 h-6 animate-spin text-[#077A7D]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-2xl font-medium text-white">Financial Identity & Profile</h3>
        <p className="text-sm text-slate-400 mt-1">
          Review and calibrate the professional identity, income parameters, and targets that shape your ONE experience.
        </p>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center gap-2.5 ${
            feedback.type === 'success'
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
              : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSaveClick} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Occupation Selection */}
          <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
              Occupation Category
            </label>
            <select
              value={occupation}
              onChange={(e) => setOccupation(e.target.value as OccupationType)}
              className="w-full px-3 py-2 text-xs bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#077A7D]"
            >
              <option value="WORKING_PROFESSIONAL" className="bg-[#06202B]">Working Professional</option>
              <option value="STUDENT" className="bg-[#06202B]">Student / Scholar</option>
              <option value="FREELANCER" className="bg-[#06202B]">Freelancer / Contractor</option>
              <option value="BUSINESS_OWNER" className="bg-[#06202B]">Business Owner</option>
              <option value="ENTREPRENEUR" className="bg-[#06202B]">Entrepreneur / Founder</option>
              <option value="HOMEMAKER" className="bg-[#06202B]">Homemaker</option>
              <option value="RETIRED" className="bg-[#06202B]">Retired</option>
              <option value="OTHER" className="bg-[#06202B]">Other Pathway</option>
            </select>
          </div>

          {/* Occupation Details */}
          <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
              Specialization / Domain
            </label>
            <input
              type="text"
              value={occupationDetails}
              onChange={(e) => setOccupationDetails(e.target.value)}
              placeholder="e.g. Senior Software Engineer, B.Tech CS"
              className="w-full px-3 py-2 text-xs bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#077A7D]"
            />
          </div>

          {/* Income Source */}
          <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
              Primary Inflow Source
            </label>
            <input
              type="text"
              value={incomeSource}
              onChange={(e) => setIncomeSource(e.target.value)}
              placeholder="e.g. Salary, Client Retainers, Family Allowance"
              className="w-full px-3 py-2 text-xs bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#077A7D]"
            />
          </div>

          {/* Monthly Inflow Range */}
          <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
              Monthly Range (INR)
            </label>
            <input
              type="text"
              value={monthlyIncomeRange}
              onChange={(e) => setMonthlyIncomeRange(e.target.value)}
              placeholder="e.g. 50000-100000"
              className="w-full px-3 py-2 text-xs bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#077A7D]"
            />
          </div>
        </div>

        {/* Goals Summary & Quick Add */}
        <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
              Priority Financial Targets ({goals.length})
            </label>
            <button
              type="button"
              onClick={() =>
                setGoals((prev) => [
                  ...prev,
                  {
                    id: `g_${Date.now()}`,
                    name: 'New Savings Target',
                    targetAmount: 50000,
                    currentSavings: 0,
                    priority: 'HIGH',
                  },
                ])
              }
              className="text-xs text-[#077A7D] hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Goal
            </button>
          </div>

          <div className="space-y-2">
            {goals.map((g, idx) => (
              <div
                key={g.id || idx}
                className="flex items-center gap-3 p-2.5 rounded-lg border border-white/5 bg-white/[0.02]"
              >
                <input
                  type="text"
                  value={g.name}
                  onChange={(e) => {
                    const updated = [...goals];
                    updated[idx].name = e.target.value;
                    setGoals(updated);
                  }}
                  className="flex-1 px-2.5 py-1 text-xs bg-black/30 border border-white/10 rounded text-white"
                />
                <input
                  type="number"
                  value={g.targetAmount || ''}
                  onChange={(e) => {
                    const updated = [...goals];
                    updated[idx].targetAmount = Number(e.target.value) || 0;
                    setGoals(updated);
                  }}
                  placeholder="Target ₹"
                  className="w-28 px-2.5 py-1 text-xs bg-black/30 border border-white/10 rounded text-white text-right"
                />
                <button
                  type="button"
                  onClick={() => setGoals(goals.filter((_, i) => i !== idx))}
                  className="p-1 text-slate-400 hover:text-rose-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving || regenerating}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#077A7D] hover:bg-[#077A7D]/90 text-white text-xs font-semibold shadow-[0_0_15px_rgba(7,122,125,0.25)] disabled:opacity-50"
          >
            {saving || regenerating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Confirmation Dialog: Regenerate Demo Data */}
      {showRegenPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-2xl border border-white/15 bg-[#06202B] shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#077A7D]/20 text-[#077A7D]">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-white">Regenerate Demo Data?</h4>
                <p className="text-xs text-slate-400">Sync simulated ledger with new profile</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Updating your financial profile will adjust future insights and recommendations. Would you also like to regenerate your demo dataset to reflect your updated profile?
            </p>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={() => executeSave(true)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#077A7D] hover:bg-[#077A7D]/90 text-white text-xs font-medium text-center shadow-lg"
              >
                Save & Regenerate Data
              </button>
              <button
                type="button"
                onClick={() => executeSave(false)}
                className="py-2.5 px-4 rounded-xl border border-white/10 hover:bg-white/[0.05] text-slate-300 text-xs font-medium text-center"
              >
                Save Only
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
