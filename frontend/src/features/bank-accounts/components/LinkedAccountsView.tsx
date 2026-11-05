'use client';

import React from 'react';
import { Building2, Plus, Wallet, RefreshCw } from 'lucide-react';
import { LinkedBankAccount } from '../types';
import { BankAccountCard } from './BankAccountCard';

interface LinkedAccountsViewProps {
  accounts: LinkedBankAccount[];
  totalBalance: number;
  onConnectMore?: () => void;
  onDelink?: (accountId: string) => void;
  onRefresh?: () => void;
  loading?: boolean;
}

export function LinkedAccountsView({
  accounts,
  totalBalance,
  onConnectMore,
  onDelink,
  onRefresh,
  loading = false,
}: LinkedAccountsViewProps) {
  return (
    <div className="w-full space-y-6">
      {/* Portfolio Balance Header Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-primary/15 via-card/80 to-card/60 backdrop-blur-xl border border-primary/20 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <Wallet className="w-4 h-4" />
            <span>Combined Liquid Net Worth</span>
          </div>

          <div className="flex items-center gap-2">
            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                disabled={loading}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                title="Sync Balances"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            )}
            {onConnectMore && (
              <button
                type="button"
                onClick={onConnectMore}
                className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:opacity-95 transition-all shadow-md shadow-primary/20"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Link Another Bank</span>
              </button>
            )}
          </div>
        </div>

        <div>
          <div className="text-3xl md:text-4xl font-mono font-bold text-foreground tracking-tight">
            ₹{totalBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Across {accounts.length} linked account{accounts.length === 1 ? '' : 's'} via Account Aggregator
          </p>
        </div>
      </div>

      {/* Account Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider px-1">
          Linked Bank Accounts
        </h3>

        {accounts.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-card/40 border border-border/60 space-y-3">
            <Building2 className="w-8 h-8 text-muted-foreground mx-auto" />
            <p className="text-sm text-foreground font-medium">No bank accounts linked yet</p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Connect your banks through the Account Aggregator to enable automated balances, transaction intelligence, and smart savings.
            </p>
            {onConnectMore && (
              <button
                type="button"
                onClick={onConnectMore}
                className="py-2.5 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:opacity-95 transition-all"
              >
                Connect Your First Bank
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accounts.map((acc) => (
              <BankAccountCard key={acc.id} account={acc} onDelink={onDelink} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
