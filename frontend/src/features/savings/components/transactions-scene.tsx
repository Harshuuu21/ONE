'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { currency, Transaction } from '@/lib/one-data';
import { SceneHeader } from '@/components/common/scene-header';
import { Search, Sparkles, RefreshCw } from 'lucide-react';
import { OneOrb } from '@/components/common/one-mark';
import { SavingsService } from '../services/savings.service';

export function TransactionsScene() {
  const [txList, setTxList] = useState<Transaction[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await SavingsService.getTransactions();
      setTxList(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = txList.filter((tx) => {
    const matchesSearch =
      tx.merchant.toLowerCase().includes(search.toLowerCase()) ||
      tx.category.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || tx.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <SceneHeader
        eyebrow="Transactions"
        title="Your money, categorized."
        subtitle="Every transaction is automatically categorized and analyzed for unusual spending patterns."
      />

      {/* AI Intelligence Card */}
      <div className="mb-6 flex items-start gap-4 rounded-3xl border border-primary/30 bg-accent p-6">
        <OneOrb size={32} />
        <div>
          <p className="font-medium text-accent-foreground">Spending Insights</p>
          <p className="mt-1 text-sm leading-relaxed text-accent-foreground/80 text-pretty">
            Automated statement sync active. Normalized across linked Account Aggregator institutions.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-4 flex flex-col sm:flex-row items-center gap-2">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transactions or categories..."
            className="w-full rounded-full border border-border bg-card py-2 pl-9 pr-4 text-sm outline-none transition-colors focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          {(['all', 'expense', 'income'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFilter(t)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                filter === t
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border bg-card text-muted-foreground hover:bg-secondary'
              }`}
            >
              {t}
            </button>
          ))}
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="p-2 rounded-full border border-border bg-card text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className={`size-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="grid gap-3">
        {filtered.map((tx, i) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03, duration: 0.3 }}
            className="group flex flex-col gap-2 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{tx.merchant}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">{tx.date}</span>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] uppercase tracking-wider text-secondary-foreground">
                    {tx.category}
                  </span>
                </div>
              </div>
              <p className={`font-serif text-lg font-medium ${tx.type === 'income' ? 'text-emerald-400' : 'text-foreground'}`}>
                {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
              </p>
            </div>
            {tx.aiInsight && (
              <div className="mt-2 flex items-start gap-2 rounded-xl bg-accent/50 p-3 text-xs text-accent-foreground">
                <Sparkles className="size-3.5 shrink-0 mt-0.5" />
                <p>{tx.aiInsight}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
