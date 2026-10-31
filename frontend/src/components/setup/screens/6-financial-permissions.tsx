'use client'

import { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { PermissionService } from '@/lib/services/permission.service'

const PERMISSIONS = [
  { id: 'tx', name: 'Transaction History', purpose: 'AI Spending Analysis' },
  { id: 'bal', name: 'Account Balance', purpose: 'Financial Dashboard' },
  { id: 'stmt', name: 'Monthly Statements', purpose: 'Generate Reports' },
  { id: 'inc', name: 'Income Credits', purpose: 'Salary Detection' },
  { id: 'deb', name: 'Debit Transactions', purpose: 'Expense Tracking' },
  { id: 'cred', name: 'Credit Transactions', purpose: 'Income Tracking' },
]

export function FinancialPermissionsScreen({ onNext }: { onNext: () => void }) {
  const [loading, setLoading] = useState(false)

  const handleApprove = async () => {
    setLoading(true)
    try {
      await PermissionService.updatePermissions('user_123', {})
      onNext()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="space-y-4">
        <h2 className="text-3xl font-serif font-semibold tracking-tight">
          Financial Permissions
        </h2>
        <p className="text-muted-foreground text-lg">
          Exactly what ONE can access and why.
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
        {PERMISSIONS.map((p) => (
          <div key={p.id} className="p-4 flex items-center justify-between hover:bg-secondary/20 transition-colors">
            <div className="space-y-1">
              <p className="font-medium text-foreground">{p.name}</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <span className="uppercase text-[10px] tracking-wider font-bold text-foreground/50">Purpose</span>
                {p.purpose}
              </p>
            </div>
            <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-2.5 py-1 rounded-md text-xs font-semibold">
              <Check className="size-3" />
              Enabled
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4">
        <button
          onClick={handleApprove}
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full max-w-sm mx-auto rounded-full bg-primary px-6 py-4 text-base font-medium text-primary-foreground transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          {loading ? 'Saving...' : 'Approve Permissions'}
          {!loading && <ArrowRight className="size-4" />}
        </button>
      </div>
    </div>
  )
}
