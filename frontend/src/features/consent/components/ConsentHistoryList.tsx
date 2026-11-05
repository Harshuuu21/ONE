'use client';

import React from 'react';
import { History, CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { ConsentEvent, ConsentEventType } from '../types';

interface ConsentHistoryListProps {
  events: ConsentEvent[];
  emptyMessage?: string;
}

export function ConsentHistoryList({
  events,
  emptyMessage = 'No consent history events recorded.',
}: ConsentHistoryListProps) {
  if (events.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  const getEventIcon = (type: ConsentEventType) => {
    switch (type) {
      case 'APPROVED':
        return <CheckCircle2 className="size-4 text-emerald-400" />;
      case 'REVOKED':
      case 'REJECTED':
        return <XCircle className="size-4 text-destructive" />;
      case 'EXPIRED':
        return <AlertCircle className="size-4 text-amber-400" />;
      default:
        return <RefreshCw className="size-4 text-primary" />;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <History className="size-3.5 text-primary" />
        <span>Consent Audit Trail</span>
      </div>

      <div className="rounded-2xl border border-border bg-card divide-y divide-border/60 overflow-hidden text-xs">
        {events.map((ev) => (
          <div key={ev.id} className="p-3.5 flex items-start justify-between gap-3 hover:bg-secondary/20 transition-colors">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{getEventIcon(ev.eventType)}</div>
              <div>
                <p className="font-semibold text-foreground">
                  Consent {ev.eventType.toLowerCase()}
                </p>
                {ev.reason && <p className="text-muted-foreground mt-0.5">{ev.reason}</p>}
                <p className="text-[10px] text-muted-foreground/80 mt-1">
                  Actor: <span className="font-mono">{ev.actor}</span>
                </p>
              </div>
            </div>
            <span className="text-[11px] text-muted-foreground whitespace-nowrap">
              {new Date(ev.createdAt).toLocaleString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
