'use client';

import React from 'react';
import { Check, ShieldCheck, ExternalLink } from 'lucide-react';
import { AAProvider } from '../types';

interface AAProviderCardProps {
  provider: AAProvider;
  isSelected: boolean;
  onSelect: (providerId: string) => void;
}

export function AAProviderCard({ provider, isSelected, onSelect }: AAProviderCardProps) {
  return (
    <div
      onClick={() => onSelect(provider.id)}
      className={`group relative p-4 md:p-5 rounded-2xl border transition-all cursor-pointer ${
        isSelected
          ? 'bg-primary/10 border-primary shadow-md shadow-primary/10 ring-1 ring-primary'
          : 'bg-card/50 hover:bg-card/90 border-border/70 hover:border-border'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3.5">
          {/* Logo / Avatar */}
          <div className="w-12 h-12 rounded-xl bg-background/80 border border-border flex items-center justify-center overflow-hidden shrink-0">
            {provider.logoUrl ? (
              <img
                src={provider.logoUrl}
                alt={provider.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <span className="font-serif font-bold text-primary text-base">
                {provider.shortName.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                {provider.name}
              </h3>
              {provider.isSandbox && (
                <span className="text-[10px] font-mono uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded">
                  Sandbox
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
              {provider.description}
            </p>
          </div>
        </div>

        {/* Selection Checkmark */}
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-all ${
            isSelected
              ? 'bg-primary border-primary text-primary-foreground'
              : 'border-border/80 bg-background/40 group-hover:border-primary/50'
          }`}
        >
          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </div>
      </div>

      {/* Footer Badges */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 mt-3 border-t border-border/40">
        <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>RBI Licensed AA</span>
        </div>
        <div className="font-mono text-[11px] text-muted-foreground">
          {provider.supportedFIPsCount}+ Banks Supported
        </div>
      </div>
    </div>
  );
}

