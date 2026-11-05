'use client';

import React, { useState } from 'react';
import { Shield, ArrowRight, Lock, Loader2, Info } from 'lucide-react';
import { AAProvider } from '../types';
import { AAProviderCard } from './AAProviderCard';
import { OneOrb } from '@/components/common/one-mark';

interface AAProviderSelectorProps {
  providers: AAProvider[];
  onContinue: (selectedProviderId: string) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

export function AAProviderSelector({
  providers,
  onContinue,
  loading = false,
  error = null,
}: AAProviderSelectorProps) {
  const [selectedId, setSelectedId] = useState<string>(
    providers.length > 0 ? providers[0].id : 'SAHAMATI_MOCK'
  );

  const handleContinue = async () => {
    if (!selectedId) return;
    await onContinue(selectedId);
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex p-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary mb-1">
          <OneOrb size={40} />
        </div>
        <h2 className="text-2xl md:text-3xl font-serif font-semibold text-foreground tracking-tight">
          Select Your Account Aggregator
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          ONE connects to the RBI-regulated Account Aggregator network to discover and link your
          bank accounts with end-to-end cryptographic privacy.
        </p>
      </div>

      {/* Security Banner */}
      <div className="p-3.5 rounded-2xl bg-primary/5 border border-primary/20 flex items-start gap-3">
        <Lock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground font-semibold">Zero Credential Storage Guarantee:</strong>{' '}
          You will authenticate directly with your Account Aggregator. ONE will never see, ask for,
          or store your bank passwords, netbanking credentials, or AA PINs.
        </div>
      </div>

      {/* Provider List */}
      <div className="space-y-3">
        {providers.map((p) => (
          <AAProviderCard
            key={p.id}
            provider={p}
            isSelected={selectedId === p.id}
            onSelect={(id) => setSelectedId(id)}
          />
        ))}
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive font-medium text-center">
          {error}
        </div>
      )}

      {/* Continue CTA */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleContinue}
          disabled={!selectedId || loading}
          className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-primary text-primary-foreground font-medium text-sm transition-all hover:opacity-95 active:scale-[0.99] disabled:opacity-40 shadow-lg shadow-primary/20"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Connecting to Provider...</span>
            </>
          ) : (
            <>
              <span>Continue to Secure AA Portal</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

