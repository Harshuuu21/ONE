'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp,
  Activity,
  Utensils,
  ShoppingBag,
  Fuel,
  Tag,
  CreditCard,
  Navigation,
  Film,
  Zap,
  GraduationCap,
  Home,
  Shield,
  HelpCircle,
  Check,
  X,
  AlertCircle,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { SpendingCategory, CategoryCorrectionResponse } from '../types';
import { SpendingService } from '../services/spending.service';

export interface EditableTransaction {
  id: string;
  merchant: string;
  amount: number;
  date: string;
  category: string;
  type?: 'expense' | 'income' | 'transfer';
  upiId?: string;
  merchantId?: string;
  originalPredictedCategory?: string;
  confidenceScore?: number;
  isManuallyCorrected?: boolean;
}

interface TransactionCategoryEditorProps {
  transaction: EditableTransaction | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (result: CategoryCorrectionResponse) => void;
}

interface CategoryOption {
  id: SpendingCategory;
  displayName: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
}

const CATEGORY_OPTIONS: CategoryOption[] = [
  {
    id: 'INVESTMENT',
    displayName: 'Investment & Wealth',
    icon: TrendingUp,
    color: '#10B981',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
  },
  {
    id: 'MEDICINE',
    displayName: 'Medicine & Health',
    icon: Activity,
    color: '#EF4444',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
  },
  {
    id: 'FOOD',
    displayName: 'Food & Dining',
    icon: Utensils,
    color: '#F59E0B',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
  },
  {
    id: 'GROCERIES',
    displayName: 'Groceries & Essentials',
    icon: ShoppingBag,
    color: '#84CC16',
    bgColor: 'bg-lime-500/10',
    borderColor: 'border-lime-500/30',
  },
  {
    id: 'PETROL',
    displayName: 'Fuel & Energy',
    icon: Fuel,
    color: '#F97316',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
  },
  {
    id: 'SHOPPING',
    displayName: 'Shopping & Apparel',
    icon: Tag,
    color: '#EC4899',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/30',
  },
  {
    id: 'SUBSCRIPTION',
    displayName: 'Subscriptions & Digital',
    icon: CreditCard,
    color: '#8B5CF6',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
  },
  {
    id: 'TRANSPORT',
    displayName: 'Transit & Commute',
    icon: Navigation,
    color: '#06B6D4',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
  },
  {
    id: 'OUTING',
    displayName: 'Entertainment & Outings',
    icon: Film,
    color: '#A855F7',
    bgColor: 'bg-purple-400/10',
    borderColor: 'border-purple-400/30',
  },
  {
    id: 'BILLS_UTILITIES',
    displayName: 'Bills & Utilities',
    icon: Zap,
    color: '#3B82F6',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
  },
  {
    id: 'EDUCATION',
    displayName: 'Education & Learning',
    icon: GraduationCap,
    color: '#6366F1',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/30',
  },
  {
    id: 'RENT',
    displayName: 'Rent & Housing',
    icon: Home,
    color: '#14B8A6',
    bgColor: 'bg-teal-500/10',
    borderColor: 'border-teal-500/30',
  },
  {
    id: 'INSURANCE',
    displayName: 'Insurance & Policies',
    icon: Shield,
    color: '#077A7D',
    bgColor: 'bg-teal-600/10',
    borderColor: 'border-teal-600/30',
  },
  {
    id: 'MISCELLANEOUS',
    displayName: 'Miscellaneous',
    icon: HelpCircle,
    color: '#64748B',
    bgColor: 'bg-slate-500/10',
    borderColor: 'border-slate-500/30',
  },
];

/**
 * Checks if a UPI handle is an ambiguous personal consumer handle
 */
function isAmbiguousPersonalHandle(vpa?: string): boolean {
  if (!vpa) return false;
  const clean = vpa.toLowerCase().trim();
  const personalDomains = ['@paytm', '@okaxis', '@oksbi', '@okhdfcbank', '@okicici', '@ybl', '@axl', '@apl'];
  const hasPersonalDomain = personalDomains.some((d) => clean.endsWith(d));
  const digits = clean.replace(/\D/g, '');
  const isPhone = digits.length >= 10;
  return hasPersonalDomain || isPhone;
}

export function TransactionCategoryEditor({
  transaction,
  isOpen,
  onClose,
  onSuccess,
}: TransactionCategoryEditorProps) {
  const [selectedCategory, setSelectedCategory] = useState<SpendingCategory>(
    (transaction?.category?.toUpperCase() as SpendingCategory) || 'MISCELLANEOUS'
  );
  const [rememberMapping, setRememberMapping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync selection when opened
  React.useEffect(() => {
    if (transaction) {
      const current = transaction.category?.toUpperCase() as SpendingCategory;
      const matched = CATEGORY_OPTIONS.find((c) => c.id === current);
      setSelectedCategory(matched ? matched.id : 'MISCELLANEOUS');
      setRememberMapping(false);
      setError(null);
    }
  }, [transaction]);

  if (!isOpen || !transaction) return null;

  const isPersonalUpi = isAmbiguousPersonalHandle(transaction.upiId);
  const originalPredicted =
    transaction.originalPredictedCategory || transaction.category;

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await SpendingService.correctCategory(transaction.id, {
        newCategory: selectedCategory,
        rememberMerchantMapping: rememberMapping && !isPersonalUpi,
      });
      onSuccess(result);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 px-2.5 py-0.5 text-xs font-medium text-teal-400 border border-teal-500/20">
                  <Sparkles className="h-3 w-3" />
                  Category Intelligence
                </span>
                {transaction.isManuallyCorrected && (
                  <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-400 border border-amber-500/20">
                    Manually Corrected
                  </span>
                )}
              </div>
              <h2 className="mt-2 text-xl font-semibold text-white">
                Reclassify Transaction
              </h2>
              <p className="mt-0.5 text-sm text-slate-400">
                Adjust the spending category and help ONE learn your financial preferences.
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Transaction Metadata Card */}
          <div className="my-5 rounded-2xl border border-white/10 bg-white/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Merchant / Entity
              </p>
              <p className="text-base font-semibold text-white mt-0.5">
                {transaction.merchant}
              </p>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                <span>{transaction.date}</span>
                {transaction.upiId && <span>UPI: {transaction.upiId}</span>}
              </div>
            </div>

            <div className="sm:text-right">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Amount
              </p>
              <p className="text-xl font-bold text-white mt-0.5">
                ₹{transaction.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
              <div className="mt-1 flex items-center sm:justify-end gap-1.5 text-xs text-slate-400">
                <span>Predicted:</span>
                <span className="font-medium text-teal-400">{originalPredicted}</span>
              </div>
            </div>
          </div>

          {/* Category Selection Grid */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-3">
              Select Verified Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-64 overflow-y-auto pr-1">
              {CATEGORY_OPTIONS.map((opt) => {
                const IconComponent = opt.icon;
                const isSelected = selectedCategory === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedCategory(opt.id)}
                    className={`relative flex items-center gap-2.5 rounded-xl border p-2.5 text-left transition ${
                      isSelected
                        ? `${opt.borderColor} ${opt.bgColor} ring-2 ring-teal-500/50`
                        : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/10'
                    }`}
                  >
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${opt.color}20`, color: opt.color }}
                    >
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-white truncate">
                        {opt.displayName}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="shrink-0 text-teal-400">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Merchant Learning Checkbox */}
          <div className="mt-5 border-t border-white/10 pt-4">
            {isPersonalUpi ? (
              <div className="flex items-start gap-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-300">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-400" />
                <span>
                  This transfer was made to an ambiguous personal UPI handle (e.g. mobile number or consumer VPA). To preserve financial integrity, persistent merchant learning cannot be applied to personal peer handles.
                </span>
              </div>
            ) : (
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMapping}
                  onChange={(e) => setRememberMapping(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-700 bg-slate-800 text-teal-500 focus:ring-teal-400"
                />
                <div>
                  <span className="text-sm font-medium text-white group-hover:text-teal-300 transition">
                    Remember this category for future transactions from &ldquo;{transaction.merchant}&rdquo;
                  </span>
                  <p className="text-xs text-slate-400 mt-0.5">
                    ONE will prioritize your verified preference for this merchant in future statements.
                  </p>
                </div>
              </label>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-3 rounded-lg bg-red-500/10 border border-red-500/20 p-2.5 text-xs text-red-400 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/10 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-500 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-teal-400 active:scale-95 transition disabled:opacity-50 shadow-lg shadow-teal-500/20"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Category'
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
