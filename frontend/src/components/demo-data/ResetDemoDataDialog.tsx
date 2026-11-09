'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, RefreshCw, ShieldCheck, GraduationCap, Briefcase, Laptop, Store } from 'lucide-react';
import { UserPersona } from '@/services/demoDataService';

interface ResetDemoDataDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReset: (persona: UserPersona) => Promise<void>;
  currentPersona?: UserPersona;
  isResetting?: boolean;
}

const PERSONAS: Array<{
  id: UserPersona;
  title: string;
  icon: React.ElementType;
  description: string;
  income: string;
}> = [
  {
    id: 'WORKING_PROFESSIONAL',
    title: 'Working Professional',
    icon: Briefcase,
    description: 'Corporate salary, vehicle loan, lifestyle spending, runway savings.',
    income: '₹85,000 – ₹1.8L / mo',
  },
  {
    id: 'STUDENT',
    title: 'Student',
    icon: GraduationCap,
    description: 'Hostel allowance, scholarship, campus food, laptop goal, education loan.',
    income: '₹20,000 – ₹38,000 / mo',
  },
  {
    id: 'FREELANCER',
    title: 'Freelancer / Creator',
    icon: Laptop,
    description: 'Variable client retainers, co-working, camera gear goal, advance tax buffer.',
    income: '₹70,000 – ₹1.6L / mo',
  },
  {
    id: 'BUSINESS_OWNER',
    title: 'Business Owner',
    icon: Store,
    description: 'Merchant POS settlements, wholesale orders, working capital loans, payroll reserve.',
    income: '₹2.0L – ₹4.8L / mo',
  },
];

export function ResetDemoDataDialog({
  isOpen,
  onClose,
  onConfirmReset,
  currentPersona = 'WORKING_PROFESSIONAL',
  isResetting = false,
}: ResetDemoDataDialogProps) {
  const [selectedPersona, setSelectedPersona] = useState<UserPersona>(currentPersona);

  const handleReset = async () => {
    await onConfirmReset(selectedPersona);
    onClose();
  };

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
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Sparkles className="size-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-medium">Regenerate Demo Data</h3>
                  <p className="text-xs text-muted-foreground">Select a persona to generate fresh financial simulation</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Safety Guarantee Notice */}
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs text-emerald-800 dark:text-emerald-300">
              <ShieldCheck className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>
                <strong>Your real data is completely safe.</strong> Only simulated demo transactions, goals, and loans will be regenerated. Real linked accounts remain untouched.
              </span>
            </div>

            {/* Persona Selector */}
            <div className="mt-4 space-y-2">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Choose Financial Persona
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {PERSONAS.map((p) => {
                  const Icon = p.icon;
                  const isSelected = selectedPersona === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPersona(p.id)}
                      className={`flex flex-col text-left rounded-2xl border p-3 transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/5 ring-1 ring-primary'
                          : 'border-border bg-background hover:border-primary/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-medium text-sm">
                          <Icon className="size-4 text-primary" />
                          <span>{p.title}</span>
                        </div>
                        {isSelected && (
                          <span className="size-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2">
                        {p.description}
                      </p>
                      <span className="mt-2 text-[10px] font-semibold text-primary/80">
                        {p.income}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                disabled={isResetting}
                className="rounded-full px-5 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={isResetting}
                className="flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-95 disabled:opacity-50 transition-opacity"
              >
                {isResetting ? (
                  <>
                    <RefreshCw className="size-4 animate-spin" />
                    <span>Regenerating...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="size-4" />
                    <span>Regenerate Demo Data</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
