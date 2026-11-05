'use client';

import React from 'react';
import { Building2, ShieldCheck, MoreVertical, Trash2 } from 'lucide-react';
import { LinkedBankAccount } from '../types';

interface BankAccountCardProps {
  account: LinkedBankAccount;
  onDelink?: (accountId: string) => void;
}

export function BankAccountCard({ account, onDelink }: BankAccountCardProps) {
  return (
    <div className="p-5 rounded-2xl bg-card/60 backdrop-blur-md border border-border/80 hover:border-border transition-all space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-background/80 border border-border flex items-center justify-center overflow-hidden shrink-0">
            {account.bankLogoUrl ? (
              <img
                src={account.bankLogoUrl}
                alt={account.bankName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <Building2 className="w-5 h-5 text-primary" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-foreground">{account.bankName}</h4>
              <span className="text-[10px] font-mono uppercase bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded">
                {account.accountType}
              </span>
            </div>
            <p className="text-xs font-mono text-muted-foreground mt-0.5">
              {account.accountNumberMasked}
            </p>
          </div>
        </div>

        {onDelink && (
          <button
            type="button"
            onClick={() => onDelink(account.id)}
            title="Delink Account"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex items-end justify-between pt-2 border-t border-border/50">
        <div>
          <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Balance</p>
          <p className="text-lg font-bold font-mono text-foreground">
            ₹{Number(account.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>AA Verified</span>
        </div>
      </div>
    </div>
  );
}
