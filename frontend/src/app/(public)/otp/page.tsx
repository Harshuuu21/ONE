'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { OneOrb } from '@/components/common/one-mark';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export default function OtpPage() {
  const [otp, setOtp] = useState('');
  const [verifying, setVerifying] = useState(false);
  const router = useRouter();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) return;
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      router.push('/dashboard');
    }, 600);
  };

  return (
    <div className="grain flex min-h-[100svh] w-full flex-col items-center justify-center p-6 bg-background">
      <form onSubmit={handleVerify} className="w-full max-w-sm space-y-8 text-center">
        <div className="flex flex-col items-center space-y-4">
          <OneOrb size={48} />
          <div>
            <h1 className="font-serif text-3xl font-semibold tracking-tight">Security Code</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Enter the 6-digit confirmation code sent to your device
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            maxLength={6}
            placeholder="••••••"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            className="w-full rounded-2xl border border-border bg-card px-4 py-4 text-center font-mono text-2xl tracking-[0.5em] outline-none focus:border-primary"
            required
          />

          <button
            type="submit"
            disabled={verifying || otp.length < 4}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-base font-medium text-primary-foreground transition-all hover:scale-[1.02] disabled:opacity-50"
          >
            {verifying ? 'Verifying...' : 'Confirm'}
            <ArrowRight className="size-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

