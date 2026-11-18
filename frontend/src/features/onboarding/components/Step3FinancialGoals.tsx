'use client';

import React, { useState } from 'react';
import { GoalItem } from '../types';
import { ShieldCheck, CreditCard, Laptop, Plane, TrendingUp, BookOpen, Clock, Check, Plus, Trash2 } from 'lucide-react';

interface Props {
  goals: GoalItem[];
  onChange: (goals: GoalItem[]) => void;
}

const GOAL_TEMPLATES = [
  { name: 'Emergency Reserve Fund', defaultTarget: 150000, category: 'EMERGENCY', icon: ShieldCheck },
  { name: 'Debt & Credit Payoff', defaultTarget: 50000, category: 'DEBT', icon: CreditCard },
  { name: 'Tech Hardware / Workstation', defaultTarget: 120000, category: 'PURCHASE', icon: Laptop },
  { name: 'International Travel & Trip', defaultTarget: 80000, category: 'TRAVEL', icon: Plane },
  { name: 'Long-Term Wealth & Equity', defaultTarget: 250000, category: 'INVESTMENT', icon: TrendingUp },
  { name: 'Education & Certifications', defaultTarget: 40000, category: 'EDUCATION', icon: BookOpen },
  { name: 'Early Financial Freedom', defaultTarget: 500000, category: 'RETIREMENT', icon: Clock },
];

export function Step3FinancialGoals({ goals, onChange }: Props) {
  const [activeGoalIndex, setActiveGoalIndex] = useState<number | null>(goals.length > 0 ? 0 : null);

  const toggleTemplateGoal = (tpl: typeof GOAL_TEMPLATES[0]) => {
    const existingIndex = goals.findIndex((g) => g.name === tpl.name);
    if (existingIndex >= 0) {
      // Remove goal
      const updated = goals.filter((_, idx) => idx !== existingIndex);
      onChange(updated);
      if (activeGoalIndex === existingIndex) {
        setActiveGoalIndex(updated.length > 0 ? 0 : null);
      }
    } else {
      // Add goal
      const newGoal: GoalItem = {
        id: `goal_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: tpl.name,
        targetAmount: tpl.defaultTarget,
        currentSavings: 0,
        priority: 'HIGH',
        category: tpl.category,
      };
      const updated = [...goals, newGoal];
      onChange(updated);
      setActiveGoalIndex(updated.length - 1);
    }
  };

  const updateGoalField = (index: number, fields: Partial<GoalItem>) => {
    const updated = goals.map((g, idx) => (idx === index ? { ...g, ...fields } : g));
    onChange(updated);
  };

  const removeGoal = (index: number) => {
    const updated = goals.filter((_, idx) => idx !== index);
    onChange(updated);
    if (activeGoalIndex === index) {
      setActiveGoalIndex(updated.length > 0 ? 0 : null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-serif text-white tracking-tight">
          What targets are you aiming for?
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Select one or more financial goals. ONE's priority engine will model monthly allocations based on your feasible surplus.
        </p>
      </div>

      {/* Goal Templates Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {GOAL_TEMPLATES.map((tpl) => {
          const isSelected = goals.some((g) => g.name === tpl.name);
          const Icon = tpl.icon;
          return (
            <button
              key={tpl.name}
              type="button"
              onClick={() => toggleTemplateGoal(tpl)}
              className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'border-[#077A7D] bg-[#077A7D]/15 text-white ring-1 ring-[#077A7D]/40'
                  : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    isSelected ? 'bg-[#077A7D] text-white' : 'bg-white/5 text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-white">{tpl.name}</p>
                  <p className="text-[11px] text-slate-400">
                    Typical target: ₹{tpl.defaultTarget.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                  isSelected
                    ? 'border-[#077A7D] bg-[#077A7D] text-white'
                    : 'border-white/20 bg-transparent'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Goal Customization Panel */}
      {goals.length > 0 && activeGoalIndex !== null && goals[activeGoalIndex] && (
        <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-sm font-semibold text-white">
              Fine-tune Target: {goals[activeGoalIndex].name}
            </h3>
            <button
              type="button"
              onClick={() => removeGoal(activeGoalIndex)}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Remove
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-slate-400 mb-1">
                Target Amount (₹)
              </label>
              <input
                type="number"
                value={goals[activeGoalIndex].targetAmount || ''}
                onChange={(e) =>
                  updateGoalField(activeGoalIndex, {
                    targetAmount: Number(e.target.value) || 0,
                  })
                }
                placeholder="50000"
                className="w-full px-3 py-2 text-sm bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#077A7D]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-slate-400 mb-1">
                Current Savings (₹)
              </label>
              <input
                type="number"
                value={goals[activeGoalIndex].currentSavings || ''}
                onChange={(e) =>
                  updateGoalField(activeGoalIndex, {
                    currentSavings: Number(e.target.value) || 0,
                  })
                }
                placeholder="0"
                className="w-full px-3 py-2 text-sm bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#077A7D]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-slate-400 mb-1">
                Priority
              </label>
              <select
                value={goals[activeGoalIndex].priority || 'HIGH'}
                onChange={(e) =>
                  updateGoalField(activeGoalIndex, {
                    priority: e.target.value as any,
                  })
                }
                className="w-full px-3 py-2 text-sm bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#077A7D]"
              >
                <option value="HIGH" className="bg-[#06202B]">High Priority</option>
                <option value="MEDIUM" className="bg-[#06202B]">Medium Priority</option>
                <option value="LOW" className="bg-[#06202B]">Low Priority</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

