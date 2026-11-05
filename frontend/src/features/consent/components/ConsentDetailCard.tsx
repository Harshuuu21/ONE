'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Calendar,
  Clock,
  Database,
  Building2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { ConsentRecord } from '../types';

interface ConsentDetailCardProps {
  consent: ConsentRecord;
  onRevoke: (consentId: string, reason?: string) => Promise<boolean>;
}

export function ConsentDetailCard({ consent, onRevoke }: ConsentDetailCardProps) {
  const [revoking, setRevoking] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const isApproved = consent.status === 'APPROVED';
  const isRevoked = consent.status === 'REVOKED';

  const handleRevokeConfirm = async () => {
    setRevoking(true);
    try {
      await onRevoke(consent.id, 'User manually revoked consent');
      setShowConfirm(false);
    } finally {
      setRevoking(false);
    }
  };

  const getStatusBadge = () => {
    switch (consent.status) {
      case 'APPROVED':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Active Consent
          </span>
        );
      case 'REVOKED':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-destructive/10 text-destructive border border-destructive/20">
            Revoked
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Expired
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            {consent.status}
          </span>
        );
    }
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-6 space-y-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`size-12 rounded-2xl flex items-center justify-center border ${
              isApproved
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-muted border-border text-muted-foreground'
            }`}
          >
            {isApproved ? <ShieldCheck className="size-6" /> : <ShieldAlert className="size-6" />}
          </div>
          <div>
            <h4 className="font-serif font-semibold text-lg text-foreground">
              {consent.metadata?.providerName || consent.aaConnection?.providerName || 'Account Aggregator Consent'}
            </h4>
            <p className="text-xs text-muted-foreground font-mono">
              Handle: {consent.consentHandle}
            </p>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="rounded-2xl border border-border bg-background/50 p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Building2 className="size-3.5 text-primary" />
            <span>Accounts</span>
          </div>
          <p className="font-semibold text-foreground">{consent.accounts.length} Linked</p>
        </div>

        <div className="rounded-2xl border border-border bg-background/50 p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="size-3.5 text-primary" />
            <span>Frequency</span>
          </div>
          <p className="font-semibold text-foreground">{consent.fetchFrequency}</p>
        </div>

        <div className="rounded-2xl border border-border bg-background/50 p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="size-3.5 text-primary" />
            <span>Valid Until</span>
          </div>
          <p className="font-semibold text-foreground">
            {new Date(consent.validUntil).toLocaleDateString()}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-background/50 p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Database className="size-3.5 text-primary" />
            <span>Data Scope</span>
          </div>
          <p className="font-semibold text-foreground">{consent.dataTypes.join(', ')}</p>
        </div>
      </div>

      <div className="text-xs text-muted-foreground bg-secondary/20 p-3.5 rounded-2xl border border-border/50">
        <span className="font-semibold text-foreground">Purpose: </span>
        {consent.purpose}
      </div>

      {isApproved && !showConfirm && (
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            className="text-xs text-destructive hover:text-destructive/80 font-medium px-4 py-2 rounded-xl border border-destructive/20 hover:bg-destructive/10 transition-colors"
          >
            Revoke Consent
          </button>
        </div>
      )}

      {showConfirm && (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 space-y-3">
          <div className="flex items-start gap-2.5 text-xs text-destructive">
            <AlertTriangle className="size-4 shrink-0 mt-0.5" />
            <p>
              Revoking consent immediately halts all automated balance syncs and AI financial analytics
              for these accounts. You can reconnect anytime.
            </p>
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowConfirm(false)}
              disabled={revoking}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleRevokeConfirm}
              disabled={revoking}
              className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-destructive text-destructive-foreground hover:opacity-90 disabled:opacity-50"
            >
              {revoking ? 'Revoking...' : 'Confirm Revocation'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

