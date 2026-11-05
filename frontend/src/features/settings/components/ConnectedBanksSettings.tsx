'use client';

import React, { useState } from 'react';
import {
  Building2,
  ShieldCheck,
  ShieldAlert,
  Plus,
  Trash2,
  RotateCcw,
  RefreshCw,
  ExternalLink,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { useBankAccounts } from '@/features/bank-accounts';
import { useConsent, ConsentReviewModal, ConsentDetailCard, ConsentHistoryList } from '@/features/consent';
import { useAccountAggregator } from '@/features/account-aggregator';
import { AAProviderSelector } from '@/features/account-aggregator/components/AAProviderSelector';
import { AccountDiscoveryList } from '@/features/bank-accounts/components/AccountDiscoveryList';

export function ConnectedBanksSettings() {
  const {
    linkedAccounts,
    totalBalance,
    loading: bankLoading,
    fetchLinked,
    delink,
    discover,
    discovered,
    selectedAccounts,
    toggleAccountSelection,
    setSelectedAccounts,
    linkSelected,
  } = useBankAccounts();

  const {
    consents,
    activeConsent,
    loading: consentLoading,
    fetchConsents,
    revokeConsent,
    requestConsent,
  } = useConsent();

  const {
    providers,
    initiate,
    loading: aaLoading,
  } = useAccountAggregator();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addStep, setAddStep] = useState<'SELECT_PROVIDER' | 'SELECT_ACCOUNTS'>('SELECT_PROVIDER');
  const [selectedProviderId, setSelectedProviderId] = useState('SAHAMATI_MOCK');
  const [delinkTargetId, setDelinkTargetId] = useState<string | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleProviderContinue = async (providerId: string) => {
    setSelectedProviderId(providerId);
    setActionError(null);
    try {
      const res = await initiate(providerId);
      await discover(providerId, res.sessionId);
      setAddStep('SELECT_ACCOUNTS');
    } catch {
      await discover(providerId);
      setAddStep('SELECT_ACCOUNTS');
    }
  };

  const handleLinkNewAccounts = async () => {
    setActionError(null);
    try {
      await linkSelected(selectedProviderId);
      setIsAddModalOpen(false);
      setAddStep('SELECT_PROVIDER');
      fetchLinked();
    } catch (err: any) {
      setActionError(err.message || 'Failed to link accounts');
    }
  };

  const handleConfirmDelink = async () => {
    if (!delinkTargetId) return;
    try {
      await delink(delinkTargetId);
      setDelinkTargetId(null);
    } catch (err: any) {
      setActionError(err.message || 'Failed to delink account');
    }
  };

  const handleRenewConsent = async () => {
    setActionError(null);
    try {
      const accountIds = linkedAccounts.map((a) => a.id);
      await requestConsent({
        providerId: selectedProviderId,
        purpose: '101 - Personal financial management and financial analytics',
        dataTypes: ['TRANSACTIONS', 'PROFILE', 'SUMMARY'],
        durationDays: 365,
        accountIds: accountIds.length > 0 ? accountIds : ['mock_acc_1'],
      });
      fetchConsents();
      setReviewModalOpen(false);
    } catch (err: any) {
      setActionError(err.message || 'Failed to renew consent');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="font-serif text-2xl font-medium text-foreground">Connected Banks &amp; Consents</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your multi-bank connections and RBI Account Aggregator authorizations.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setAddStep('SELECT_PROVIDER');
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground transition-all hover:opacity-95 shadow-md shadow-primary/20"
        >
          <Plus className="size-4" />
          <span>Add Bank or Account</span>
        </button>
      </div>

      {actionError && (
        <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs">
          {actionError}
        </div>
      )}

      {/* Explanatory Distinction Banner */}
      <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 text-xs text-muted-foreground flex items-start gap-3">
        <Info className="size-4 text-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-medium text-foreground">Understanding Account Management vs. ReBIT Consent</p>
          <p>
            <strong className="text-foreground">Delinking an account</strong> removes it from your ONE dashboard view.
            <br />
            <strong className="text-foreground">Revoking consent</strong> immediately prohibits ONE from receiving any
            further automated balance or transaction updates from the Account Aggregator network under RBI regulations.
          </p>
        </div>
      </div>

      {/* Section 1: Linked Accounts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Linked Bank Accounts ({linkedAccounts.length})
          </h4>
          <button
            type="button"
            onClick={fetchLinked}
            disabled={bankLoading}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className={`size-3.5 ${bankLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {linkedAccounts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center bg-background/50">
            <Building2 className="mx-auto size-8 text-muted-foreground mb-2" />
            <p className="text-sm font-medium text-foreground">No bank accounts linked yet</p>
            <p className="text-xs text-muted-foreground mt-1 mb-4">
              Connect your bank via Account Aggregator to enable automated insights.
            </p>
            <button
              onClick={() => {
                setAddStep('SELECT_PROVIDER');
                setIsAddModalOpen(true);
              }}
              className="text-xs font-semibold px-4 py-2 rounded-xl bg-primary text-primary-foreground"
            >
              Connect First Bank
            </button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {linkedAccounts.map((acc) => (
              <div
                key={acc.id}
                className="p-4 rounded-2xl border border-border bg-background flex flex-col justify-between gap-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-secondary/80 border border-border flex items-center justify-center text-primary font-bold">
                      <Building2 className="size-5" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-sm text-foreground">{acc.bankName}</h5>
                      <p className="text-xs font-mono text-muted-foreground mt-0.5">
                        {acc.accountType} &bull; {acc.accountNumberMasked}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {acc.status}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
                  <div>
                    <span className="text-muted-foreground text-[11px]">Balance: </span>
                    <span className="font-mono font-semibold text-foreground">
                      ₹{acc.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDelinkTargetId(acc.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors text-[11px] flex items-center gap-1"
                  >
                    <Trash2 className="size-3.5" />
                    <span>Delink</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: ReBIT Financial Consent Status */}
      <div className="space-y-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Account Aggregator Consent
          </h4>
          {activeConsent ? (
            <button
              type="button"
              onClick={() => setReviewModalOpen(true)}
              className="text-xs text-primary hover:underline font-medium"
            >
              Review Consent Terms
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setReviewModalOpen(true)}
              className="text-xs font-semibold px-3 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20"
            >
              Renew / Authorize Consent
            </button>
          )}
        </div>

        {activeConsent ? (
          <ConsentDetailCard consent={activeConsent} onRevoke={revokeConsent} />
        ) : (
          <div className="rounded-2xl border border-dashed border-amber-500/30 bg-amber-500/5 p-6 space-y-3">
            <div className="flex items-start gap-3">
              <ShieldAlert className="size-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground">No Active Financial Consent</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Automated statement analysis is paused. You can renew your consent anytime to restore AI features.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setReviewModalOpen(true)}
              className="text-xs font-semibold px-4 py-2 rounded-xl bg-primary text-primary-foreground"
            >
              Authorize Consent
            </button>
          </div>
        )}

        {/* Audit Trail */}
        {consents.length > 0 && consents[0].events && (
          <div className="pt-2">
            <ConsentHistoryList events={consents[0].events} />
          </div>
        )}
      </div>

      {/* Delink Confirmation Dialog */}
      {delinkTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-3xl border border-destructive/20 bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-destructive">
              <AlertTriangle className="size-6" />
              <h4 className="font-semibold text-foreground">Remove Account?</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              This will remove the selected account from your ONE interface. Note that this does NOT revoke
              your overall AA data consent. You can reconnect it anytime.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDelinkTargetId(null)}
                className="px-3.5 py-2 text-xs font-medium rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelink}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-destructive text-destructive-foreground hover:opacity-90"
              >
                Confirm Delink
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Bank Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-lg text-foreground">
                {addStep === 'SELECT_PROVIDER' ? 'Link Bank via Account Aggregator' : 'Select Discovered Accounts'}
              </h4>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-xs"
              >
                Close
              </button>
            </div>

            {addStep === 'SELECT_PROVIDER' ? (
              <AAProviderSelector
                providers={providers}
                onContinue={handleProviderContinue}
                loading={aaLoading}
              />
            ) : (
              <div className="space-y-4">
                <AccountDiscoveryList
                  accounts={discovered}
                  selectedAccounts={selectedAccounts}
                  onToggleAccount={toggleAccountSelection}
                  onSelectAll={() => setSelectedAccounts(discovered)}
                  onDeselectAll={() => setSelectedAccounts([])}
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setAddStep('SELECT_PROVIDER')}
                    className="px-4 py-2 text-xs rounded-xl border border-border text-muted-foreground"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleLinkNewAccounts}
                    disabled={selectedAccounts.length === 0}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-primary text-primary-foreground disabled:opacity-50"
                  >
                    Link {selectedAccounts.length} Account(s)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Review / Renew Consent Modal */}
      <ConsentReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        onApprove={handleRenewConsent}
        loading={consentLoading}
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
