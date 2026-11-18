'use client';

import React, { useState } from 'react';
import { OccupationType } from '../types';
import {
  GraduationCap,
  Briefcase,
  Laptop,
  Store,
  Rocket,
  Home,
  Clock,
  Sparkles,
} from 'lucide-react';

interface Props {
  occupation: OccupationType;
  occupationDetails?: string;
  onChange: (occupation: OccupationType, details?: string) => void;
}

const OCCUPATION_OPTIONS: Array<{
  type: OccupationType;
  label: string;
  description: string;
  icon: React.ElementType;
}> = [
  {
    type: 'STUDENT',
    label: 'Student / Scholar',
    description: 'School, undergraduate, graduate, or research fellowship',
    icon: GraduationCap,
  },
  {
    type: 'WORKING_PROFESSIONAL',
    label: 'Working Professional',
    description: 'Corporate, technology, public sector, healthcare, or services',
    icon: Briefcase,
  },
  {
    type: 'FREELANCER',
    label: 'Freelancer / Contractor',
    description: 'Independent consultant, creator, designer, or specialist',
    icon: Laptop,
  },
  {
    type: 'BUSINESS_OWNER',
    label: 'Business Owner',
    description: 'Retail, trade, manufacturing, agency, or local commerce',
    icon: Store,
  },
  {
    type: 'ENTREPRENEUR',
    label: 'Entrepreneur / Founder',
    description: 'Early-stage startup founder, builder, or venture creator',
    icon: Rocket,
  },
  {
    type: 'HOMEMAKER',
    label: 'Homemaker',
    description: 'Managing household finances, family budgets, and reserves',
    icon: Home,
  },
  {
    type: 'RETIRED',
    label: 'Retired',
    description: 'Pension management, wealth preservation, and fixed returns',
    icon: Clock,
  },
  {
    type: 'OTHER',
    label: 'Other Pathway',
    description: 'Career break, sabbatical, or customized financial trajectory',
    icon: Sparkles,
  },
];

export function Step1ProfessionalIdentity({
  occupation,
  occupationDetails,
  onChange,
}: Props) {
  const [details, setDetails] = useState(occupationDetails || '');

  const handleSelectOccupation = (type: OccupationType) => {
    onChange(type, details);
  };

  const handleDetailsChange = (val: string) => {
    setDetails(val);
    onChange(occupation, val);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-serif text-white tracking-tight">
          Tell us about your professional pathway
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          ONE customizes your cash flow models, benchmarks, and community recommendations based on your daily reality.
        </p>
      </div>

      {/* Occupation Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {OCCUPATION_OPTIONS.map((opt) => {
          const isSelected = occupation === opt.type;
          const Icon = opt.icon;
          return (
            <button
              key={opt.type}
              type="button"
              onClick={() => handleSelectOccupation(opt.type)}
              className={`flex items-start gap-3.5 p-4 rounded-xl text-left border transition-all duration-200 ${
                isSelected
                  ? 'border-[#077A7D] bg-[#077A7D]/15 text-white ring-1 ring-[#077A7D]/50 shadow-[0_0_20px_rgba(7,122,125,0.2)]'
                  : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/20 hover:bg-white/[0.06]'
              }`}
            >
              <div
                className={`p-2 rounded-lg shrink-0 ${
                  isSelected ? 'bg-[#077A7D] text-white' : 'bg-white/5 text-slate-400'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">{opt.label}</p>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  {opt.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Dynamic Conditional Sub-questions */}
      <div className="pt-2">
        {occupation === 'STUDENT' && (
          <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-3">
            <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
              Education Level & Discipline
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['Undergraduate', 'Postgraduate', 'Doctoral', 'High School'].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => handleDetailsChange(lvl)}
                  className={`px-3 py-2 text-xs rounded-lg border text-center transition-all ${
                    details.includes(lvl)
                      ? 'border-[#077A7D] bg-[#077A7D]/20 text-white font-medium'
                      : 'border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        )}

        {occupation === 'WORKING_PROFESSIONAL' && (
          <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-3">
            <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
              Industry Domain & Sector
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {['Technology & IT', 'Finance & Banking', 'Corporate & Sales', 'Healthcare', 'Public Sector', 'Education / Research'].map((ind) => (
                <button
                  key={ind}
                  type="button"
                  onClick={() => handleDetailsChange(ind)}
                  className={`px-3 py-2 text-xs rounded-lg border text-center transition-all ${
                    details === ind
                      ? 'border-[#077A7D] bg-[#077A7D]/20 text-white font-medium'
                      : 'border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20'
                  }`}
                >
                  {ind}
                </button>
              ))}
            </div>
          </div>
        )}

        {occupation === 'FREELANCER' && (
          <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-3">
            <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
              Primary Practice Area
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {['Software Development', 'Product & UI/UX Design', 'Content & Copywriting', 'Marketing & Growth', 'Consulting', 'Video & Media'].map((dom) => (
                <button
                  key={dom}
                  type="button"
                  onClick={() => handleDetailsChange(dom)}
                  className={`px-3 py-2 text-xs rounded-lg border text-center transition-all ${
                    details === dom
                      ? 'border-[#077A7D] bg-[#077A7D]/20 text-white font-medium'
                      : 'border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20'
                  }`}
                >
                  {dom}
                </button>
              ))}
            </div>
          </div>
        )}

        {(occupation === 'BUSINESS_OWNER' || occupation === 'ENTREPRENEUR') && (
          <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-3">
            <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
              Venture Stage & Scale
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {['Solo / Bootstrapped', 'Early-Stage (< 10 staff)', 'Growth Stage', 'Retail & Commerce', 'D2C Brand', 'Agency / Services'].map((stg) => (
                <button
                  key={stg}
                  type="button"
                  onClick={() => handleDetailsChange(stg)}
                  className={`px-3 py-2 text-xs rounded-lg border text-center transition-all ${
                    details === stg
                      ? 'border-[#077A7D] bg-[#077A7D]/20 text-white font-medium'
                      : 'border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20'
                  }`}
                >
                  {stg}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

