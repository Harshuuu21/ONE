'use client';

import React from 'react';
import { Building2, Search } from 'lucide-react';

interface BankSelectorProps {
  banks: { id: string; name: string; count?: number }[];
  selectedBankId: string | null;
  onSelectBank: (bankId: string | null) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function BankSelector({
  banks,
  selectedBankId,
  onSelectBank,
  searchQuery = '',
  onSearchChange,
}: BankSelectorProps) {
  return (
    <div className="space-y-3">
      {onSearchChange && (
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search bank name or account..."
            className="w-full rounded-xl border border-border bg-card/60 pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
          />
        </div>
      )}

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => onSelectBank(null)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
            selectedBankId === null
              ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
              : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-secondary/40'
          }`}
        >
          <Building2 className="size-3.5" />
          All Banks
        </button>

        {banks.map((b) => {
          const isSelected = selectedBankId === b.id;
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => onSelectBank(isSelected ? null : b.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-secondary/40'
              }`}
            >
              <span>{b.name}</span>
              {b.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                    isSelected ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {b.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

