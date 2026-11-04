'use client';

import { useState } from 'react';
import { ArrowRight, HandHeart } from 'lucide-react';
import { CommunityService } from '../services/community.service';

export function BorrowingRequest({ onSuccess }: { onSuccess?: () => void }) {
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !purpose) return;
    setSubmitting(true);
    await CommunityService.submitBorrowRequest(Number(amount), purpose);
    setSubmitting(false);
    setDone(true);
    onSuccess?.();
  };

  if (done) {
    return (
      <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6 text-center">
        <HandHeart className="mx-auto size-8 text-primary mb-2" />
        <h4 className="font-serif text-lg font-medium">Request Submitted</h4>
        <p className="mt-1 text-xs text-muted-foreground">
          Your community circle has been notified and can now review your request.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-border bg-card p-6 space-y-4">
      <div>
        <h4 className="font-serif text-lg font-medium">Request Community Support</h4>
        <p className="text-xs text-muted-foreground mt-0.5">
          Zero predatory interest. Backed by mutual trust and reputation score.
        </p>
      </div>
      <div className="space-y-2">
        <label className="text-xs text-muted-foreground font-medium">Amount Needed ($)</label>
        <input
          type="number"
          placeholder="e.g. 250"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs text-muted-foreground font-medium">What is this for?</label>
        <textarea
          placeholder="e.g. Tools for upcoming contract work"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          required
          rows={3}
          className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary resize-none"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground transition-all hover:scale-[1.02] disabled:opacity-50"
      >
        {submitting ? 'Submitting...' : 'Post Request'}
        <ArrowRight className="size-4" />
      </button>
    </form>
  );
}

