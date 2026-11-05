'use client';

import React from 'react';
import { Check, Building2, ShieldCheck, CheckSquare, Square, Info } from 'lucide-react';
import { DiscoveredAccount } from '../types';

interface AccountDiscoveryListProps {
  accounts: DiscoveredAccount[];
  selectedAccounts: DiscoveredAccount[];
  onToggleAccount: (account: DiscoveredAccount) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

export function AccountDiscoveryList({
  accounts,
  selectedAccounts,
  onToggleAccount,
  onSelectAll,
  onDeselectAll,
}: AccountDiscoveryListProps) {
  const isSelected = (acc: DiscoveredAccount) =>
    selectedAccounts.some(
      (a) => a.fipId === acc.fipId && a.accountNumberMasked === acc.accountNumberMasked
    );

  const allSelected = accounts.length > 0 && selectedAccounts.length === accounts.length;

  return (
    <div className="w-full space-y-4">
      {/* Header Controls */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <div className="flex items-center gap-1.5 font-medium text-foreground">
          <span>{accounts.length} Accounts Discovered</span>
          <span>&bull;</span>
          <span className="text-primary font-semibold font-mono">
            {selectedAccounts.length} Selected
          </span>
        </div>

        <button
          type="button"
          onClick={allSelected ? onDeselectAll : onSelectAll}
          className="text-primary hover:underline font-medium"
        >
          {allSelected ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      {/* Account Items */}
      <div className="space-y-3">
        {accounts.map((acc) => {
          const selected = isSelected(acc);
          return (
            <div
              key={`${acc.fipId}_${acc.accountNumberMasked}`}
              onClick={() => onToggleAccount(acc)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                selected
                  ? 'bg-primary/10 border-primary ring-1 ring-primary/60 shadow-sm'
                  : 'bg-card/50 hover:bg-card/80 border-border/70 hover:border-border'
              }`}
            >
              <div className="flex items-center gap-3.5">
                {/* Bank Icon / Logo */}
                <div className="w-11 h-11 rounded-xl bg-background/80 border border-border flex items-center justify-center overflow-hidden shrink-0">
                  {acc.bankLogoUrl ? (
                    <img
                      src={acc.bankLogoUrl}
                      alt={acc.bankName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <Building2 className="w-5 h-5 text-primary" />
                  )}
                </div>

                {/* Details */}
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-foreground">{acc.bankName}</h4>
                    <span className="text-[10px] font-mono uppercase bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.2 rounded">
                      {acc.accountType}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-muted-foreground mt-0.5">
                    {acc.accountNumberMasked}
                  </p>
                </div>
              </div>

              {/* Right Side: Balance & Checkbox */}
              <div className="flex items-center gap-4">
                {acc.balance !== undefined && (
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-muted-foreground">Available</p>
                    <p className="text-sm font-semibold text-foreground font-mono">
                      ₹{acc.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                )}

                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                    selected
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'border-border/80 bg-background/50'
                  }`}
                >
                  {selected && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
