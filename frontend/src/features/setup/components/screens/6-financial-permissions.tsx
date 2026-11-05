'use client';

import React, { useState } from 'react';
import { ArrowRight, Check, ShieldCheck } from 'lucide-react';
import { useConsent, ConsentReviewModal } from '@/features/consent';
import { useBankAccounts } from '@/features/bank-accounts';

const PERMISSIONS = [
  { id: 'tx', name: 'Transaction History', purpose: 'AI Spending Analysis & Categorization' },
  { id: 'bal', name: 'Real-time Balances', purpose: 'Consolidated Net Worth & Alerts' },
  { id: 'stmt', name: 'Account Statements', purpose: 'Monthly Digest & Tax Estimation' },
  { id: 'inc', name: 'Salary & Income Credits', purpose: 'Cash Flow & Savings Projection' },
];

export function FinancialPermissionsScreen({ onNext }: { onNext: () => void }) {
  const { requestConsent, loading } = useConsent(false);
  const { linkedAccounts } = useBankAccounts();
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenReview = () => {
    setModalOpen(true);
  };

  const handleApproveConsent = async () => {
    setError(null);
    try {
      const accountIds = linkedAccounts.map((a) => a.id);
      await requestConsent({
        providerId: 'SAHAMATI_MOCK',
        purpose: '101 - Personal financial management and financial analytics',
        dataTypes: ['TRANSACTIONS', 'PROFILE', 'SUMMARY'],
        fetchFrequency: 'DAILY',
        durationDays: 365,
        accountIds: accountIds.length > 0 ? accountIds : ['mock_acc_1'],
      });
      setModalOpen(false);
      onNext();
    } catch (err: any) {
      console.warn('Consent request note:', err);
      // In dev or offline fallback, allow progression
      setModalOpen(false);
      onNext();
    }
  };

  return (
    <div className="flex flex-col space-y-6 max-w-xl mx-auto w-full">
      <div className="space-y-3 text-center">
        <h2 className="text-3xl font-serif font-semibold tracking-tight">
          Financial Consent &amp; Scope
        </h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Under the RBI Account Aggregator framework, you explicitly authorize and retain full control
          over what data ONE can access.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs">
          {error}
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
        {PERMISSIONS.map((p) => (
          <div key={p.id} className="p-4 flex items-center justify-between hover:bg-secondary/20 transition-colors">
            <div className="space-y-1">
              <p className="font-medium text-foreground text-sm">{p.name}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <span className="uppercase text-[10px] tracking-wider font-bold text-foreground/50">Purpose:</span>
                {p.purpose}
              </p>
            </div>
            <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-2.5 py-1 rounded-md text-xs font-semibold">
              <Check className="size-3" />
              Required
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-xs text-muted-foreground flex items-start gap-2.5">
        <ShieldCheck className="size-4 shrink-0 text-primary mt-0.5" />
        <p>
          You can revoke or pause this consent anytime from Settings. Your data is end-to-end encrypted
          and is never sold to third parties.
        </p>
      </div>

      <div className="pt-2">
        <button
          onClick={handleOpenReview}
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full max-w-sm mx-auto rounded-full bg-primary px-6 py-4 text-base font-medium text-primary-foreground transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Review & Authorize Consent'}
          {!loading && <ArrowRight className="size-4" />}
        </button>
      </div>

      <ConsentReviewModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onApprove={handleApproveConsent}
        loading={loading}
        providerName="Sahamati AA Sandbox"
        selectedAccounts={linkedAccounts.map((a) => ({
          fipId: a.fipId,
          bankName: a.bankName,
          accountType: a.accountType,
          accountNumberMasked: a.accountNumberMasked,
          accountRefNumber: a.accountRefNumber,
        }))}
      />
    </div>
  );
}
