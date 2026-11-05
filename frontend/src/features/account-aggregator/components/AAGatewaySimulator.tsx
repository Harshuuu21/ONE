'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ShieldCheck,
  Building2,
  CheckCircle2,
  Lock,
  ArrowRight,
  KeyRound,
  Check,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface MockAccount {
  id: string;
  fipId: string;
  bankName: string;
  accountType: 'SAVINGS' | 'CHECKING' | 'CREDIT';
  accountNumberMasked: string;
  accountRefNumber: string;
  balance: number;
}

const MOCK_DISCOVERED: MockAccount[] = [
  {
    id: 'mock_hdfc_01',
    fipId: 'FIP_HDFC',
    bankName: 'HDFC Bank',
    accountType: 'SAVINGS',
    accountNumberMasked: 'XXXX-XXXX-4921',
    accountRefNumber: 'ACC_REF_HDFC_4921',
    balance: 142850.5,
  },
  {
    id: 'mock_icici_02',
    fipId: 'FIP_ICICI',
    bankName: 'ICICI Bank',
    accountType: 'CHECKING',
    accountNumberMasked: 'XXXX-XXXX-8812',
    accountRefNumber: 'ACC_REF_ICICI_8812',
    balance: 563200.0,
  },
  {
    id: 'mock_sbi_03',
    fipId: 'FIP_SBI',
    bankName: 'State Bank of India',
    accountType: 'SAVINGS',
    accountNumberMasked: 'XXXX-XXXX-1934',
    accountRefNumber: 'ACC_REF_SBI_1934',
    balance: 89450.0,
  },
  {
    id: 'mock_axis_04',
    fipId: 'FIP_AXIS',
    bankName: 'Axis Bank',
    accountType: 'SAVINGS',
    accountNumberMasked: 'XXXX-XXXX-7729',
    accountRefNumber: 'ACC_REF_AXIS_7729',
    balance: 34100.25,
  },
];

export function AAGatewaySimulator() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sessionId = searchParams.get('session_id') || searchParams.get('sessionId') || `sess_${Date.now()}`;
  const providerId = searchParams.get('providerId') || 'SAHAMATI_MOCK';
  const consentHandle = searchParams.get('handle') || searchParams.get('consentHandle');
  const returnUrl = searchParams.get('returnUrl') || '/setup';

  const [step, setStep] = useState<'LOGIN' | 'ACCOUNTS' | 'BANK_OTP' | 'CONSENT' | 'COMPLETED'>('LOGIN');
  const [pin, setPin] = useState('1234');
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([
    'mock_hdfc_01',
    'mock_icici_02',
  ]);
  const [bankOtp, setBankOtp] = useState('123456');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleAccount = (id: string) => {
    setSelectedAccountIds((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((a) => a !== id) : prev) : [...prev, id]
    );
  };

  const handleApprove = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const selectedAccounts = MOCK_DISCOVERED.filter((a) => selectedAccountIds.includes(a.id));

      // Post callback to backend AA connection endpoint
      const aaCallbackUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/aa/callback`;
      await fetch(aaCallbackUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-aa-signature': 'mock_signature_valid',
        },
        body: JSON.stringify({
          providerId,
          sessionId,
          status: 'SUCCESS',
          linkedAccounts: selectedAccounts.map((a) => ({
            fipId: a.fipId,
            bankName: a.bankName,
            accountType: a.accountType,
            accountNumberMasked: a.accountNumberMasked,
            accountRefNumber: a.accountRefNumber,
            balance: a.balance,
          })),
        }),
      }).catch((e) => console.warn('AA callback non-blocking catch:', e));

      // If consent handle is present, also trigger consent approval callback
      if (consentHandle) {
        const consentCallbackUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/consents/callback`;
        await fetch(consentCallbackUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-aa-signature': 'mock_signature_valid',
          },
          body: JSON.stringify({
            providerId,
            consentHandle,
            status: 'APPROVED',
            consentId: `rebit_c_${Date.now()}`,
          }),
        }).catch((e) => console.warn('Consent callback non-blocking catch:', e));
      }

      setStep('COMPLETED');
      setTimeout(() => {
        router.push(returnUrl);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Approval failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = () => {
    router.push(`${returnUrl}?status=declined`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 font-sans">
      {/* Top Brand Bar */}
      <div className="max-w-md mx-auto w-full flex items-center justify-between py-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
            <Lock className="size-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white">Sahamati AA Gateway</h1>
            <p className="text-[10px] text-slate-400">RBI Regulated Account Aggregator</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          <ShieldCheck className="size-3.5" />
          <span>256-bit SSL</span>
        </div>
      </div>

      {/* Main Sandbox Box */}
      <div className="max-w-md mx-auto w-full my-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl space-y-6">
          {/* Breadcrumb Steps */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 pb-3 border-b border-slate-800/80">
            <span className={step === 'LOGIN' ? 'text-teal-400 font-bold' : ''}>1. AA PIN</span>
            <span>&rarr;</span>
            <span className={step === 'ACCOUNTS' ? 'text-teal-400 font-bold' : ''}>2. Accounts</span>
            <span>&rarr;</span>
            <span className={step === 'BANK_OTP' ? 'text-teal-400 font-bold' : ''}>3. Bank OTP</span>
            <span>&rarr;</span>
            <span className={step === 'CONSENT' || step === 'COMPLETED' ? 'text-teal-400 font-bold' : ''}>
              4. Consent
            </span>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="size-4" />
              <span>{error}</span>
            </div>
          )}

          {/* Step 1: AA Login */}
          {step === 'LOGIN' && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white">Sign in to Account Aggregator</h2>
                <p className="text-xs text-slate-400">
                  Enter your 4-digit AA PIN to authenticate your registered mobile number.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">AA Security PIN</label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                  <input
                    type="password"
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-10 pr-4 py-3 text-base text-center tracking-widest text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-500">Sandbox default PIN: 1234</p>
              </div>

              <button
                type="button"
                onClick={() => setStep('ACCOUNTS')}
                disabled={pin.length < 4}
                className="w-full rounded-2xl bg-teal-500 text-slate-950 font-semibold py-3 text-sm hover:bg-teal-400 transition-all disabled:opacity-50"
              >
                Verify AA Identity
              </button>
            </div>
          )}

          {/* Step 2: Discovered Bank Accounts */}
          {step === 'ACCOUNTS' && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white">Select Accounts to Link</h2>
                <p className="text-xs text-slate-400">
                  We found {MOCK_DISCOVERED.length} accounts linked to your mobile across multiple banks.
                </p>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {MOCK_DISCOVERED.map((acc) => {
                  const isSelected = selectedAccountIds.includes(acc.id);
                  return (
                    <div
                      key={acc.id}
                      onClick={() => toggleAccount(acc.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-teal-500 bg-teal-500/10'
                          : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-xl bg-slate-800 flex items-center justify-center text-teal-400">
                          <Building2 className="size-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{acc.bankName}</p>
                          <p className="text-xs text-slate-400">
                            {acc.accountType} &bull; {acc.accountNumberMasked}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`size-5 rounded-md flex items-center justify-center border transition-all ${
                          isSelected
                            ? 'bg-teal-500 border-teal-500 text-slate-950'
                            : 'border-slate-700 bg-slate-900'
                        }`}
                      >
                        {isSelected && <Check className="size-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setStep('BANK_OTP')}
                disabled={selectedAccountIds.length === 0}
                className="w-full rounded-2xl bg-teal-500 text-slate-950 font-semibold py-3 text-sm hover:bg-teal-400 transition-all disabled:opacity-50"
              >
                Proceed with {selectedAccountIds.length} Account(s)
              </button>
            </div>
          )}

          {/* Step 3: Bank OTP Verification */}
          {step === 'BANK_OTP' && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white">Bank Authorization OTP</h2>
                <p className="text-xs text-slate-400">
                  Your banks sent an OTP to authorize linking to the Account Aggregator network.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                <span className="text-slate-400">Linking accounts for: </span>
                <span className="font-semibold text-white">
                  {selectedAccountIds
                    .map((id) => MOCK_DISCOVERED.find((a) => a.id === id)?.bankName)
                    .join(', ')}
                </span>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">6-Digit Bank OTP</label>
                <input
                  type="text"
                  maxLength={6}
                  value={bankOtp}
                  onChange={(e) => setBankOtp(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-lg font-mono text-center tracking-widest text-white focus:border-teal-500 focus:outline-none"
                />
                <p className="text-[11px] text-slate-500">Sandbox test OTP: 123456</p>
              </div>

              <button
                type="button"
                onClick={() => setStep('CONSENT')}
                disabled={bankOtp.length < 6}
                className="w-full rounded-2xl bg-teal-500 text-slate-950 font-semibold py-3 text-sm hover:bg-teal-400 transition-all disabled:opacity-50"
              >
                Confirm Bank OTP
              </button>
            </div>
          )}

          {/* Step 4: ReBIT Consent Approval */}
          {step === 'CONSENT' && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white">Grant Financial Information Consent</h2>
                <p className="text-xs text-slate-400">
                  Authorize ONE AI to fetch encrypted statements and balances.
                </p>
              </div>

              <div className="space-y-2 rounded-2xl bg-slate-950 border border-slate-800 p-4 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Consumer:</span>
                  <span className="font-semibold text-white">ONE Financial Assistant</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Purpose:</span>
                  <span className="font-semibold text-white">101 - Personal Financial Management</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Data Types:</span>
                  <span className="font-semibold text-white">Profile, Balances, Transactions</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Frequency:</span>
                  <span className="font-semibold text-emerald-400">DAILY (Automatic Sync)</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleReject}
                  disabled={submitting}
                  className="flex-1 rounded-2xl border border-slate-800 bg-slate-950 py-3 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Decline
                </button>
                <button
                  type="button"
                  onClick={handleApprove}
                  disabled={submitting}
                  className="flex-2 rounded-2xl bg-teal-500 text-slate-950 font-semibold py-3 text-sm hover:bg-teal-400 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? 'Signing Consent...' : 'Approve & Link'}
                  {!submitting && <ArrowRight className="size-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Success Step */}
          {step === 'COMPLETED' && (
            <div className="py-8 text-center space-y-4">
              <div className="size-16 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="size-9" />
              </div>
              <h2 className="text-lg font-bold text-white">Linking &amp; Consent Approved!</h2>
              <p className="text-xs text-slate-400">
                Returning you securely to ONE Financial Assistant...
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-md mx-auto w-full text-center text-[10px] text-slate-500">
        Simulated Account Aggregator Gateway &bull; Compliant with RBI Master Direction &amp; ReBIT FIU Specifications
      </div>
    </div>
  );
}

