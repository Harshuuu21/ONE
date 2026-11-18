'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { useFinancialIdentity } from '../hooks/useFinancialIdentity';
import { Step1ProfessionalIdentity } from './Step1ProfessionalIdentity';
import { Step2FinancialProfile } from './Step2FinancialProfile';
import { Step3FinancialGoals } from './Step3FinancialGoals';
import { Step4FinancialInterests } from './Step4FinancialInterests';
import { Step5OnboardingComplete } from './Step5OnboardingComplete';
import { OneOrb } from '@/components/common/one-mark';
import { ArrowLeft, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

const STEP_TITLES = [
  'Professional Identity',
  'Income & Cash Flow',
  'Financial Goals',
  'Topics & Learning',
  'Identity Review',
];

export function OnboardingWizard() {
  const router = useRouter();
  const {
    profile,
    setProfile,
    loading,
    saving,
    error,
    saveStepProgress,
    completeOnboardingWizard,
  } = useFinancialIdentity();

  const [currentStep, setCurrentStep] = useState(1);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Resume step from saved profile if available
  useEffect(() => {
    if (profile.onboardingStep && profile.onboardingStep >= 1 && profile.onboardingStep <= 5) {
      // If onboarding already completed, redirect directly to dashboard
      if (profile.onboardingComplete) {
        router.push('/dashboard');
      } else {
        setCurrentStep(profile.onboardingStep);
      }
    }
  }, [profile.onboardingStep, profile.onboardingComplete, router]);

  const handleNext = async () => {
    setValidationError(null);

    // Step validation checks
    if (currentStep === 1 && !profile.occupation) {
      setValidationError('Please select your professional category to proceed.');
      return;
    }

    if (currentStep < 5) {
      const next = currentStep + 1;
      setCurrentStep(next);
      // Autosave partial progress
      await saveStepProgress(profile, next);
    }
  };

  const handleBack = () => {
    setValidationError(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleFinalSubmit = async () => {
    setValidationError(null);
    try {
      await completeOnboardingWizard(profile);
      router.push('/dashboard');
    } catch (err: any) {
      setValidationError(err.message || 'Failed to complete onboarding setup.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[85svh] flex flex-col items-center justify-center gap-3">
        <div className="animate-pulse">
          <OneOrb size={48} />
        </div>
        <p className="text-xs text-slate-400 font-medium">
          Loading your financial profile...
        </p>
      </div>
    );
  }

  const progressPercentage = Math.round((currentStep / 5) * 100);

  return (
    <div className="min-h-[90svh] flex flex-col justify-between max-w-2xl mx-auto px-4 py-8">
      {/* Top Header & Progress */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <OneOrb size={32} />
            <span className="text-sm font-semibold tracking-wider uppercase text-white">
              ONE OS
            </span>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium text-slate-400">
              Step {currentStep} of 5
            </p>
            <p className="text-xs font-semibold text-white">
              {STEP_TITLES[currentStep - 1]}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#077A7D] transition-all duration-300 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Error Message */}
      {(validationError || error) && (
        <div className="mb-4 p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{validationError || error}</span>
        </div>
      )}

      {/* Main Step Container with Slide Animation */}
      <div className="flex-1 py-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.2 }}
          >
            {currentStep === 1 && (
              <Step1ProfessionalIdentity
                occupation={profile.occupation}
                occupationDetails={profile.occupationDetails}
                onChange={(occ, details) =>
                  setProfile((prev) => ({
                    ...prev,
                    occupation: occ,
                    occupationDetails: details,
                  }))
                }
              />
            )}

            {currentStep === 2 && (
              <Step2FinancialProfile
                occupation={profile.occupation}
                incomeSource={profile.incomeSource}
                monthlyIncomeRange={profile.monthlyIncomeRange}
                incomeFrequency={profile.incomeFrequency}
                incomeStability={profile.incomeStability}
                financialResponsibilities={profile.financialResponsibilities}
                onChange={(fields) =>
                  setProfile((prev) => ({
                    ...prev,
                    ...fields,
                  }))
                }
              />
            )}

            {currentStep === 3 && (
              <Step3FinancialGoals
                goals={profile.financialGoals || []}
                onChange={(goals) =>
                  setProfile((prev) => ({
                    ...prev,
                    financialGoals: goals,
                  }))
                }
              />
            )}

            {currentStep === 4 && (
              <Step4FinancialInterests
                interests={profile.interests || []}
                onChange={(interests) =>
                  setProfile((prev) => ({
                    ...prev,
                    interests,
                  }))
                }
              />
            )}

            {currentStep === 5 && (
              <Step5OnboardingComplete
                profile={profile}
                onSubmit={handleFinalSubmit}
                loading={saving}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation Buttons (Steps 1 to 4) */}
      {currentStep < 5 && (
        <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-6">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1 || saving}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium border border-white/10 transition-all ${
              currentStep === 1
                ? 'opacity-0 pointer-events-none'
                : 'text-slate-300 hover:bg-white/[0.05] hover:border-white/20'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={saving}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#077A7D] hover:bg-[#077A7D]/90 text-white text-xs font-medium transition-all shadow-[0_0_15px_rgba(7,122,125,0.25)]"
          >
            {saving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

