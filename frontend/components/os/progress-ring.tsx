'use client'

import { motion } from 'motion/react'

export function ProgressRing({
  value,
  size = 64,
  stroke = 6,
  children,
  tone = 'primary',
}: {
  value: number // 0..1
  size?: number
  stroke?: number
  children?: React.ReactNode
  tone?: 'primary' | 'gold'
}) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const color = tone === 'gold' ? 'var(--gold)' : 'var(--primary)'
  return (
    <span className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: c - c * Math.min(value, 1) }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.21, 0.6, 0.35, 1] }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center">{children}</span>
    </span>
  )
}
