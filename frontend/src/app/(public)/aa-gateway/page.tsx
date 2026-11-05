import React, { Suspense } from 'react';
import { AAGatewaySimulator } from '@/features/account-aggregator/components/AAGatewaySimulator';

export default function AAGatewayPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm">
          Loading Account Aggregator Portal...
        </div>
      }
    >
      <AAGatewaySimulator />
    </Suspense>
  );
}
