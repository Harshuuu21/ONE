'use client';

import React, { useState } from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useAccountAggregator } from '@/features/account-aggregator';
import { AAProviderSelector } from '@/features/account-aggregator/components/AAProviderSelector';
import { AAConnectingScreen } from '@/features/account-aggregator/components/AAConnectingScreen';
import { useBankAccounts } from '@/features/bank-accounts';
import { AccountDiscoveryList } from '@/features/bank-accounts/components/AccountDiscoveryList';
import { AAProvider } from '@/features/account-aggregator/types';

export function ConnectBankScreen({ onNext }: { onNext: () => void }) {
  const {
    providers,
    initiate,
    loading: aaLoading,
    error: aaError,
  } = useAccountAggregator();

  const {
    discovered,
    selectedAccounts,
    discover,
    toggleAccountSelection,
    setSelectedAccounts,
    linkSelected,
    loading: bankLoading,
    error: bankError,
  } = useBankAccounts();

  const [mode, setMode] = useState<'SELECT_PROVIDER' | 'CONNECTING' | 'SELECT_ACCOUNTS' | 'SUCCESS'>('SELECT_PROVIDER');
  const [chosenProvider, setChosenProvider] = useState<AAProvider | null>(null);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  const handleProviderContinue = async (providerId: string) => {
    const prov: AAProvider = providers.find((p) => p.id === providerId) || {
      id: providerId,
      name: 'Account Aggregator',
      shortName: 'AA',
      logoUrl: '',
      description: 'RBI-regulated Account Aggregator',
      supportedFIPsCount: 4,
      isAvailable: true,
      isSandbox: true,
    };
    setChosenProvider(prov);
    setMode('CONNECTING');

    try {
      const res = await initiate(providerId);
      if (res.redirectUrl) {
        setRedirectUrl(res.redirectUrl);
      }
      // Discover accounts for this provider session
      await discover(providerId, res.sessionId);
      setMode('SELECT_ACCOUNTS');
    } catch {
      // In dev or sandbox fallback: discover directly
      await discover(providerId);
      setMode('SELECT_ACCOUNTS');
    }
  };

  const handleConfirmLinking = async () => {
    if (!chosenProvider) return;
    try {
      await linkSelected(chosenProvider.id);
      setMode('SUCCESS');
    } catch (err) {
      console.error('Link selected failed:', err);
    }
  };

  if (mode === 'CONNECTING' && chosenProvider) {
    return (
      <div className="max-w-md mx-auto w-full">
        <AAConnectingScreen
          provider={chosenProvider}
          redirectUrl={redirectUrl || undefined}
        />
      </div>
    );
  }

  if (mode === 'SELECT_ACCOUNTS') {
    return (
      <div className="space-y-6 max-w-xl mx-auto w-full">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-serif font-bold text-foreground">
            Discovered Bank Accounts
          </h2>
          <p className="text-sm text-muted-foreground">
            Select the accounts you want to connect to ONE Financial Assistant.
          </p>
        </div>

        {bankError && (
          <div className="p-3.5 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs">
            {bankError}
          </div>
        )}

        <AccountDiscoveryList
          accounts={discovered}
          selectedAccounts={selectedAccounts}
          onToggleAccount={toggleAccountSelection}
          onSelectAll={() => setSelectedAccounts(discovered)}
          onDeselectAll={() => setSelectedAccounts([])}
        />

        <div className="pt-4 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setMode('SELECT_PROVIDER')}
            className="px-4 py-2.5 rounded-xl border border-border bg-card text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleConfirmLinking}
            disabled={bankLoading || selectedAccounts.length === 0}
            className="px-6 py-2.5 rounded-xl bg-primary text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {bankLoading ? 'Linking Accounts...' : `Link ${selectedAccounts.length} Account(s)`}
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'SUCCESS') {
    return (
      <div className="flex flex-col space-y-8 items-center text-center">
        <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
          <ShieldCheck className="size-10" />
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-serif font-semibold tracking-tight">
            Accounts Linked Successfully
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Your bank accounts have been verified through RBI's Account Aggregator network.
          </p>
        </div>

        <div className="pt-6 w-full max-w-sm">
          <button
            onClick={onNext}
            className="flex items-center justify-center gap-2 w-full rounded-full bg-primary px-6 py-4 text-base font-medium text-primary-foreground transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Continue to Permissions
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6 text-center max-w-xl mx-auto w-full">
      <div className="space-y-2">
        <h2 className="text-3xl font-serif font-semibold tracking-tight">
          Securely Connect Your Bank
        </h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          ONE connects via RBI-licensed Account Aggregators. You explicitly authorize data sharing.
        </p>
      </div>

      <div className="bg-destructive/5 text-destructive rounded-2xl p-4 text-xs font-medium max-w-md mx-auto w-full text-left flex items-start gap-2.5">
        <ShieldCheck className="size-4 shrink-0 text-destructive mt-0.5" />
        <span>
          We NEVER ask for your Internet Banking Password, Debit PIN, UPI PIN, or banking passwords.
        </span>
      </div>

      <div className="text-left">
        <AAProviderSelector
          providers={providers}
          onContinue={handleProviderContinue}
          loading={aaLoading}
          error={aaError}
        />
      </div>
    </div>
  );
}
