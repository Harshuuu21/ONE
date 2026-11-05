'use client';

import React from 'react';
import { ShieldCheck, CheckCircle2, Building2, RefreshCw, AlertCircle } from 'lucide-react';
import { AAConnection } from '../types';

interface AAConnectionStatusProps {
  connections: AAConnection[];
  onConnectAnother?: () => void;
  onRefresh?: () => void;
}

export function AAConnectionStatus({
  connections,
  onConnectAnother,
  onRefresh,
}: AAConnectionStatusProps) {
  if (connections.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Active AA Connections
        </h3>
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync</span>
          </button>
        )}
      </div>

      <div className="space-y-3">
        {connections.map((conn) => (
          <div
            key={conn.id}
            className="p-4 rounded-2xl bg-card/60 border border-border/80 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-foreground">{conn.providerName}</h4>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      conn.status === 'ACTIVE'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}
                  >
                    {conn.status}
                  </span>
                </div>
                {conn.aaCustomerHandle && (
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">
                    {conn.aaCustomerHandle}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span className="hidden sm:inline">Linked</span>
            </div>
          </div>
        ))}
      </div>

      {onConnectAnother && (
        <button
          type="button"
          onClick={onConnectAnother}
          className="text-xs font-medium text-primary hover:underline transition-all block text-center w-full pt-1"
        >
          + Connect another Account Aggregator
        </button>
      )}
    </div>
  );
}
