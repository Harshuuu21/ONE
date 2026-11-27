'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useTheme, Theme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

/**
 * Compact icon button to toggle between Light and Dark mode.
 * Ideal for headers, navigation bars, and utility docks.
 */
export function ThemeToggle({
  className,
  size = 'md',
  showLabel = false,
}: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        'group relative inline-flex items-center justify-center rounded-full text-muted-foreground transition-all hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
        size === 'sm' ? 'size-7 p-1' : 'size-8 p-1.5',
        className
      )}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <motion.div
        key={resolvedTheme}
        initial={{ rotate: -90, scale: 0.7, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        exit={{ rotate: 90, scale: 0.7, opacity: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="flex items-center justify-center"
      >
        {isDark ? (
          <Sun className={cn(size === 'sm' ? 'size-3.5' : 'size-4', 'text-amber-300 group-hover:text-amber-200 transition-colors')} />
        ) : (
          <Moon className={cn(size === 'sm' ? 'size-3.5' : 'size-4', 'text-teal-700 group-hover:text-teal-800 transition-colors')} />
        )}
      </motion.div>
      {showLabel && (
        <span className="ml-2 text-xs font-medium">
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
}

interface ThemeSegmentedControlProps {
  className?: string;
}

const THEME_OPTIONS: Array<{
  id: Theme;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}> = [
  {
    id: 'light',
    label: 'Light Mode',
    icon: Sun,
    description: 'Crisp warm paper & deep evergreen',
  },
  {
    id: 'dark',
    label: 'Dark Mode',
    icon: Moon,
    description: 'Deep night-forest & luminous teal',
  },
  {
    id: 'system',
    label: 'System OS',
    icon: Laptop,
    description: 'Matches your device preference',
  },
];

/**
 * Full interactive 3-way selector (Light / Dark / System) for Settings pages and modals.
 */
export function ThemeSegmentedControl({ className }: ThemeSegmentedControlProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <div className={cn('space-y-2', className)}>
      <div
        className="grid grid-cols-3 gap-2 rounded-2xl border border-border bg-secondary/50 p-1.5"
        role="radiogroup"
        aria-label="Theme mode options"
      >
        {THEME_OPTIONS.map((opt) => {
          const isSelected = theme === opt.id;
          const Icon = opt.icon;

          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => setTheme(opt.id)}
              className={cn(
                'relative flex items-center justify-center gap-2 rounded-xl py-2 px-3 text-xs font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                isSelected
                  ? 'text-foreground font-semibold shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {isSelected && (
                <motion.div
                  layoutId="active-theme-pill"
                  className="absolute inset-0 rounded-xl bg-card border border-border/80 shadow-sm"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5 truncate">
                <Icon
                  className={cn(
                    'size-3.5 shrink-0',
                    isSelected
                      ? opt.id === 'light'
                        ? 'text-amber-500 dark:text-amber-400'
                        : opt.id === 'dark'
                        ? 'text-teal-600 dark:text-teal-400'
                        : 'text-primary'
                      : 'text-muted-foreground'
                  )}
                />
                <span className="hidden sm:inline">{opt.label}</span>
                <span className="sm:hidden">{opt.label.split(' ')[0]}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between px-1 text-[11px] text-muted-foreground">
        <span>Active rendering: <strong className="text-foreground capitalize">{resolvedTheme} theme</strong></span>
        {theme === 'system' && <span className="italic">(Syncing with OS)</span>}
      </div>
    </div>
  );
}
