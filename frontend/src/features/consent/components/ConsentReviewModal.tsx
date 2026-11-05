'use client';

import React from 'react';
import {
  ShieldCheck,
  Calendar,
  Clock,
  Database,
  Building2,
  AlertTriangle,
  X,
  CheckCircle2,
} from 'lucide-react';
import { DiscoveredAccount } from '@/features/bank-accounts/types';

interface ConsentReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
  loading?: boolean;
  providerName: string;
  selectedAccounts: DiscoveredAccount[];
  purpose?: string;
  dataTypes?: string[];
  frequency?: string;
  durationDays?: number;
}

export function ConsentReviewModal({
  isOpen,
  onClose,
  onApprove,
  loading = false,
  providerName,
  selectedAccounts,
  purpose = '101 - Personal financial management, expense categorization, and smart analytics',
  dataTypes = ['Account Profile', 'Summary & Balances', 'Transaction History'],
  frequency = 'DAILY',
  durationDays = 365,
}: ConsentReviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <ShieldCheck className="size-6" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold text-foreground">Financial Consent</h3>
              <p className="text-xs text-muted-foreground">ReBIT RBI Account Aggregator Framework</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Warning / Privacy Note */}
        <div className="rounded-2xl bg-primary/5 border border-primary/20 p-4 text-xs text-muted-foreground space-y-1">
          <div className="flex items-center gap-1.5 text-primary font-medium">
            <ShieldCheck className="size-4" />
            <span>Strict End-to-End Encryption</span>
          </div>
          <p>
            Data will be fetched through <span className="font-semibold text-foreground">{providerName}</span> only
            with your explicit consent. ONE cannot perform transactions or debit your accounts.
          </p>
        </div>

        {/* Selected Accounts */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Building2 className="size-3.5 text-primary" />
            Accounts Covered ({selectedAccounts.length})
          </label>
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {selectedAccounts.map((acc) => (
              <div
                key={acc.accountRefNumber}
                className="flex items-center justify-between p-2.5 rounded-xl border border-border bg-background text-xs"
              >
                <div>
                  <span className="font-medium text-foreground">{acc.bankName}</span>
                  <span className="text-muted-foreground ml-2">({acc.accountType})</span>
                </div>
                <span className="font-mono text-muted-foreground">{acc.accountNumberMasked}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Terms Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-xl border border-border p-3 space-y-1 bg-background/50">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Database className="size-3.5 text-primary" />
              <span>Data Types</span>
            </div>
            <p className="font-medium text-foreground">{dataTypes.join(', ')}</p>
          </div>

          <div className="rounded-xl border border-border p-3 space-y-1 bg-background/50">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="size-3.5 text-primary" />
              <span>Sync Frequency</span>
            </div>
            <p className="font-medium text-foreground">{frequency}</p>
          </div>

          <div className="rounded-xl border border-border p-3 space-y-1 bg-background/50">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="size-3.5 text-primary" />
              <span>Validity Duration</span>
            </div>
            <p className="font-medium text-foreground">{durationDays} Days</p>
          </div>

          <div className="rounded-xl border border-border p-3 space-y-1 bg-background/50">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <CheckCircle2 className="size-3.5 text-primary" />
              <span>Revocable</span>
            </div>
            <p className="font-medium text-emerald-400">Anytime via Settings</p>
          </div>
        </div>

        {/* Purpose */}
        <div className="space-y-1 text-xs">
          <label className="font-semibold uppercase tracking-wider text-muted-foreground">Purpose</label>
          <div className="rounded-xl border border-border p-3 bg-background/50 text-foreground">
            {purpose}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={onApprove}
            disabled={loading}
            className="flex-2 rounded-2xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Submitting Consent...' : 'Approve & Connect'}
          </button>
        </div>
      </div>
    </div>
  );
}

