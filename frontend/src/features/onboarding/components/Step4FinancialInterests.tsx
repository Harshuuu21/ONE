'use client';

import React from 'react';
import {
  PieChart,
  TrendingUp,
  CreditCard,
  Receipt,
  Users,
  Compass,
  BookOpen,
  Check,
} from 'lucide-react';

interface Props {
  interests: string[];
  onChange: (interests: string[]) => void;
}

const INTEREST_TOPICS = [
  {
    id: 'budgeting',
    title: 'Budgeting & Expense Tracking',
    description: 'Real-time transaction categorization and automated runway monitoring.',
    icon: PieChart,
  },
  {
    id: 'investing',
    title: 'Investing & Wealth Growth',
    description: 'Mutual funds, index funds, SIPs, and balanced portfolio allocation.',
    icon: TrendingUp,
  },
  {
    id: 'debt_management',
    title: 'Debt & Credit Score Improvement',
    description: 'Repayment acceleration, credit utilization management, and bureau tracking.',
    icon: CreditCard,
  },
  {
    id: 'tax_planning',
    title: 'Tax Planning & Optimization',
    description: 'Section 80C deductions, regime comparison, and advance tax estimation.',
    icon: Receipt,
  },
  {
    id: 'community_savings',
    title: 'Community & Peer Lending Circles',
    description: 'Collaborative funding, community backing, and peer reputation scoring.',
    icon: Users,
  },
  {
    id: 'retirement',
    title: 'Retirement & Long-Term Wealth',
    description: 'Compounding calculators, pension planning, and financial freedom milestones.',
    icon: Compass,
  },
  {
    id: 'financial_literacy',
    title: 'Financial Literacy & Education',
    description: 'Bite-sized guides on personal finance essentials, risk, and asset classes.',
    icon: BookOpen,
  },
];

export function Step4FinancialInterests({ interests, onChange }: Props) {
  const toggleInterest = (title: string) => {
    if (interests.includes(title)) {
      onChange(interests.filter((i) => i !== title));
    } else {
      onChange([...interests, title]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-serif text-white tracking-tight">
          What financial topics interest you most?
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          ONE tailors your daily AI briefing, proactive alerts, and educational articles according to these topics.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {INTEREST_TOPICS.map((topic) => {
          const isSelected = interests.includes(topic.title);
          const Icon = topic.icon;

          return (
            <button
              key={topic.id}
              type="button"
              onClick={() => toggleInterest(topic.title)}
              className={`flex items-start gap-3.5 p-4 rounded-xl text-left border transition-all duration-200 ${
                isSelected
                  ? 'border-[#077A7D] bg-[#077A7D]/15 text-white ring-1 ring-[#077A7D]/50 shadow-[0_0_16px_rgba(7,122,125,0.2)]'
                  : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/20 hover:bg-white/[0.05]'
              }`}
            >
              <div
                className={`p-2 rounded-lg shrink-0 ${
                  isSelected ? 'bg-[#077A7D] text-white' : 'bg-white/5 text-slate-400'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-white">{topic.title}</p>
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center border transition-all ${
                      isSelected
                        ? 'border-[#077A7D] bg-[#077A7D] text-white'
                        : 'border-white/20 bg-transparent'
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  {topic.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

