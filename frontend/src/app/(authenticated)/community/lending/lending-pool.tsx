'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { Heart, ShieldCheck } from 'lucide-react';
import { currency, type LendingRequest } from '@/lib/one-data';

export function LendingPool({
  requests,
  onBack,
}: {
  requests: LendingRequest[];
  onBack: (req: LendingRequest) => void;
}) {
  return (
    <div className="space-y-4">
      {requests.map((r, i) => {
        const pct = Math.round((r.funded / r.amount) * 100);
        return (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="rounded-3xl border border-border bg-card p-6"
          >
            <div className="flex items-start gap-3.5">
              <div className="relative size-12 shrink-0 overflow-hidden rounded-full border border-border">
                <Image src={r.avatar || '/placeholder.svg'} alt={r.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{r.name}</p>
                    <span className="flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground font-mono">
                      <ShieldCheck className="size-3 text-primary" /> {r.reputation}
                    </span>
                  </div>
                  <span className="rounded-full bg-secondary/60 px-2.5 py-0.5 text-xs text-muted-foreground">
                    {r.termMonths}mo term
                  </span>
                </div>
                <p className="mt-1 font-serif text-lg leading-snug text-foreground/90">{r.reason}</p>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{r.story}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    <strong className="text-foreground">{currency(r.funded)}</strong> of {currency(r.amount)}
                  </span>
                  <span>{pct}%</span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: 0.15 }}
                  />
                </div>
                <div className="mt-4 flex items-center justify-end">
                  <button
                    onClick={() => onBack(r)}
                    className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-all hover:scale-105"
                  >
                    <Heart className="size-3.5" /> Back Loan
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
