'use client';

import React from 'react';
import { OccupationType } from '../types';

interface Props {
  occupation: OccupationType;
  incomeSource?: string;
  monthlyIncomeRange?: string;
  incomeFrequency?: string;
  incomeStability?: string;
  financialResponsibilities?: string;
  onChange: (fields: {
    incomeSource?: string;
    monthlyIncomeRange?: string;
    incomeFrequency?: string;
    incomeStability?: string;
    financialResponsibilities?: string;
  }) => void;
}

export function Step2FinancialProfile({
  occupation,
  incomeSource,
  monthlyIncomeRange,
  incomeFrequency,
  incomeStability,
  financialResponsibilities,
  onChange,
}: Props) {
  // Appropriate income brackets tailored to the selected occupation
  const incomeRanges =
    occupation === 'STUDENT'
      ? [
          { label: 'Under ₹10,000', value: '0-10000' },
          { label: '₹10,000 – ₹25,000', value: '10000-25000' },
          { label: '₹25,000 – ₹50,000', value: '25000-50000' },
          { label: '₹50,000+', value: '50000-100000' },
          { label: 'Prefer not to disclose', value: 'undisclosed' },
        ]
      : [
          { label: '₹25,000 – ₹50,000', value: '25000-50000' },
          { label: '₹50,000 – ₹1,00,000', value: '50000-100000' },
          { label: '₹1,00,000 – ₹2,50,000', value: '100000-250000' },
          { label: '₹2,50,000 – ₹5,00,000', value: '250000-500000' },
          { label: '₹5,00,000+', value: '500000-1000000' },
          { label: 'Prefer not to disclose', value: 'undisclosed' },
        ];

  const incomeSources =
    occupation === 'STUDENT'
      ? ['Family Allowance', 'Academic Scholarship / Stipend', 'Part-time Work', 'Freelance Projects', 'Internship Payouts']
      : ['Monthly Salary', 'Client Invoices & Contracts', 'Business Operating Revenue', 'Consulting Retainers', 'Investment Dividends', 'Multiple Streams'];

  const frequencyOptions = [
    { label: 'Monthly Regular', value: 'MONTHLY' },
    { label: 'Irregular / Milestones', value: 'IRREGULAR' },
    { label: 'Weekly / Bi-weekly', value: 'WEEKLY' },
    { label: 'Annual / One-time', value: 'ANNUAL' },
  ];

  const stabilityOptions = [
    { label: 'High (Predictable Salary)', value: 'HIGH' },
    { label: 'Moderate (Base + Bonus)', value: 'MODERATE' },
    { label: 'Variable (Contract / Seasonal)', value: 'VARIABLE' },
  ];

  const commonObligations = [
    'House Rent / Mess',
    'Education Loan EMI',
    'Vehicle Loan EMI',
    'Family Remittances',
    'Credit Card Balances',
    'No Major Obligations',
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-serif text-white tracking-tight">
          Your Income & Cash Flow Profile
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          This lets ONE calibrate your initial savings velocity and monthly surplus accurately.
        </p>
      </div>

      {/* 1. Primary Income Source */}
      <div className="space-y-2">
        <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
          Primary Income Source
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {incomeSources.map((source) => (
            <button
              key={source}
              type="button"
              onClick={() => onChange({ incomeSource: source })}
              className={`px-3 py-2.5 text-xs rounded-xl border text-left transition-all ${
                incomeSource === source
                  ? 'border-[#077A7D] bg-[#077A7D]/20 text-white font-medium ring-1 ring-[#077A7D]/40'
                  : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/20'
              }`}
            >
              {source}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Monthly Income Bracket (INR) */}
      <div className="space-y-2">
        <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
          Approximate Monthly Inflow (INR)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {incomeRanges.map((range) => (
            <button
              key={range.value}
              type="button"
              onClick={() => onChange({ monthlyIncomeRange: range.value })}
              className={`px-3 py-2.5 text-xs rounded-xl border text-center transition-all ${
                monthlyIncomeRange === range.value
                  ? 'border-[#077A7D] bg-[#077A7D]/20 text-white font-medium ring-1 ring-[#077A7D]/40 shadow-[0_0_12px_rgba(7,122,125,0.2)]'
                  : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/20'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Inflow Frequency & Stability */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
            Payment Frequency
          </label>
          <div className="space-y-1.5">
            {frequencyOptions.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => onChange({ incomeFrequency: f.value })}
                className={`w-full px-3 py-2 text-xs rounded-lg border text-left transition-all ${
                  incomeFrequency === f.value
                    ? 'border-[#077A7D] bg-[#077A7D]/20 text-white font-medium'
                    : 'border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
            Income Stability
          </label>
          <div className="space-y-1.5">
            {stabilityOptions.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => onChange({ incomeStability: s.value })}
                className={`w-full px-3 py-2 text-xs rounded-lg border text-left transition-all ${
                  incomeStability === s.value
                    ? 'border-[#077A7D] bg-[#077A7D]/20 text-white font-medium'
                    : 'border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Financial Responsibilities */}
      <div className="space-y-2">
        <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
          Fixed Commitments & Outflows (Optional)
        </label>
        <div className="flex flex-wrap gap-2">
          {commonObligations.map((ob) => {
            const isSelected = (financialResponsibilities || '').includes(ob);
            return (
              <button
                key={ob}
                type="button"
                onClick={() => {
                  let updated = financialResponsibilities || '';
                  if (isSelected) {
                    updated = updated
                      .replace(ob, '')
                      .replace(/,\s*,/g, ',')
                      .trim();
                  } else {
                    updated = updated ? `${updated}, ${ob}` : ob;
                  }
                  onChange({ financialResponsibilities: updated });
                }}
                className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                  isSelected
                    ? 'border-[#077A7D] bg-[#077A7D]/20 text-white font-medium'
                    : 'border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20'
                }`}
              >
                {ob}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

