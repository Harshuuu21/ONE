'use client';

import React, { useState } from 'react';
import { SceneHeader } from '@/components/common/scene-header';
import { useBankAccounts } from '@/features/bank-accounts';
import { LinkedAccountsView } from '@/features/bank-accounts/components/LinkedAccountsView';
import { useAccountAggregator } from '@/features/account-aggregator';
import { AAProviderSelector } from '@/features/account-aggregator/components/AAProviderSelector';
import { AccountDiscoveryList } from '@/features/bank-accounts/components/AccountDiscoveryList';
import { AAProvider } from '@/features/account-aggregator/types';
import { ShieldCheck, X, Sparkles } from 'lucide-react';
import { useDemoData } from '@/hooks/useDemoData';
import { DemoDataBadge } from '@/components/demo-data/DemoDataBadge';

export function WalletView() {
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
    providers,
    initiate,
    loading: aaLoading,
    error: aaError,
  } = useAccountAggregator();

  const { summary } = useDemoData();

  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [connectStep, setConnectStep] = useState<'SELECT_PROVIDER' | 'SELECT_ACCOUNTS'>('SELECT_PROVIDER');
  const [chosenProviderId, setChosenProviderId] = useState<string>('SAHAMATI_MOCK');
  const [modalError, setModalError] = useState<string | null>(null);

  const handleProviderContinue = async (providerId: string) => {
    setChosenProviderId(providerId);
    setModalError(null);
    try {
      const res = await initiate(providerId);
      await discover(providerId, res.sessionId);
      setConnectStep('SELECT_ACCOUNTS');
    } catch {
      await discover(providerId);
      setConnectStep('SELECT_ACCOUNTS');
    }
  };

  const handleLinkAccounts = async () => {
    setModalError(null);
    try {
      await linkSelected(chosenProviderId);
      setConnectModalOpen(false);
      setConnectStep('SELECT_PROVIDER');
      fetchLinked();
    } catch (err: any) {
      setModalError(err.message || 'Failed to link accounts');
    }
  };

  return (
    <div className="space-y-8">
      <SceneHeader
        eyebrow="Financial Accounts"
        title="Wallet &amp; Connected Banks"
        subtitle="Live multi-bank account portfolio synchronized securely through RBI's Account Aggregator framework."
      />

      {/* Main Multi-Bank Accounts View */}
      <LinkedAccountsView
        accounts={linkedAccounts}
        totalBalance={linkedAccounts.length > 0 ? totalBalance : (summary?.financials?.closingBalance || 0)}
        loading={bankLoading}
        onRefresh={fetchLinked}
        onDelink={delink}
        onConnectMore={() => {
          setConnectStep('SELECT_PROVIDER');
          setConnectModalOpen(true);
        }}
      />

      {/* Account Aggregator Connection Modal */}
      {connectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-serif font-bold text-foreground">
                  {connectStep === 'SELECT_PROVIDER'
                    ? 'Link Bank via Account Aggregator'
                    : 'Select Bank Accounts'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {connectStep === 'SELECT_PROVIDER'
                    ? 'Choose an RBI-regulated Account Aggregator'
                    : 'Choose accounts discovered for your mobile number'}
                </p>
              </div>
              <button
                onClick={() => setConnectModalOpen(false)}
                className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3.5 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                {modalError}
              </div>
            )}

            {connectStep === 'SELECT_PROVIDER' ? (
              <div className="space-y-4">
                <div className="rounded-2xl bg-primary/5 border border-primary/20 p-4 text-xs text-muted-foreground flex items-start gap-2.5">
                  <ShieldCheck className="size-4 shrink-0 text-primary mt-0.5" />
                  <span>
                    ONE connects via official AA bridges without accessing your netbanking passwords or PINs.
                  </span>
                </div>
                <AAProviderSelector
                  providers={providers}
                  onContinue={handleProviderContinue}
                  loading={aaLoading}
                  error={aaError}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <AccountDiscoveryList
                  accounts={discovered}
                  selectedAccounts={selectedAccounts}
                  onToggleAccount={toggleAccountSelection}
                  onSelectAll={() => setSelectedAccounts(discovered)}
                  onDeselectAll={() => setSelectedAccounts([])}
                />

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setConnectStep('SELECT_PROVIDER')}
                    className="px-4 py-2.5 rounded-xl border border-border bg-card text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleLinkAccounts}
                    disabled={bankLoading || selectedAccounts.length === 0}
                    className="px-6 py-2.5 rounded-xl bg-primary text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-all"
                  >
                    {bankLoading ? 'Linking Accounts...' : `Link ${selectedAccounts.length} Account(s)`}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Named alias export for backwards compatibility
export { WalletView as LendingScene };
