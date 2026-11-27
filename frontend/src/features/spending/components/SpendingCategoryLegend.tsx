'use client';

import React from 'react';
import {
  TrendingUp,
  Activity,
  Utensils,
  ShoppingBag,
  Fuel,
  Tag,
  CreditCard,
  Compass,
  Film,
  Zap,
  GraduationCap,
  Home,
  Shield,
  Gamepad2,
  Plane,
  HelpCircle,
} from 'lucide-react';
import { SpendingChartSlice } from '../types/spending.types';

const ICONS_MAP: Record<string, React.ElementType> = {
  TrendingUp,
  Activity,
  Utensils,
  ShoppingBag,
  Fuel,
  Tag,
  CreditCard,
  Compass,
  Film,
  Zap,
  GraduationCap,
  Home,
  Shield,
  Gamepad2,
  Plane,
  HelpCircle,
};

interface SpendingCategoryLegendProps {
  slices: SpendingChartSlice[];
  hoveredCategory: string | null;
  onHoverCategory: (categoryName: string | null) => void;
  selectedCategory: string | null;
  onSelectCategory: (categoryName: string | null) => void;
}

export function SpendingCategoryLegend({
  slices,
  hoveredCategory,
  onHoverCategory,
  selectedCategory,
  onSelectCategory,
}: SpendingCategoryLegendProps) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full"
      role="list"
      aria-label="Spending category legend"
    >
      {slices.map((slice) => {
        const IconComponent = ICONS_MAP[slice.iconName] || HelpCircle;
        const isHovered = hoveredCategory === slice.name;
        const isSelected = selectedCategory === slice.name;
        const isDimmed =
          (hoveredCategory || selectedCategory) &&
          hoveredCategory !== slice.name &&
          selectedCategory !== slice.name;

        return (
          <button
            key={slice.id}
            type="button"
            role="listitem"
            aria-selected={isSelected}
            aria-label={`${slice.name}: ${slice.percentage}% across ${slice.transactionCount} transactions`}
            onMouseEnter={() => onHoverCategory(slice.name)}
            onMouseLeave={() => onHoverCategory(null)}
            onFocus={() => onHoverCategory(slice.name)}
            onBlur={() => onHoverCategory(null)}
            onClick={() => {
              if (selectedCategory === slice.name) {
                onSelectCategory(null);
              } else {
                onSelectCategory(slice.name);
              }
            }}
            className={`group relative flex items-center justify-between gap-3 rounded-2xl border px-3 py-2.5 text-left transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${
              isHovered || isSelected
                ? 'border-primary/40 bg-primary/10 shadow-sm ring-1 ring-primary/20 dark:border-white/20 dark:bg-white/[0.08] dark:shadow-md dark:ring-white/10'
                : 'border-border/60 bg-muted/40 hover:border-border hover:bg-muted/70 dark:border-white/5 dark:bg-white/[0.02] dark:hover:border-white/10 dark:hover:bg-white/[0.05]'
            } ${isDimmed ? 'opacity-40' : 'opacity-100'}`}
          >
            {/* Color Dot & Category Info */}
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Category Color Indicator Pill */}
              <div
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: `${slice.color}20`,
                  color: slice.color,
                }}
              >
                <IconComponent className="h-3.5 w-3.5" />
              </div>

              {/* Name */}
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground dark:text-white truncate">
                  {slice.name}
                </p>
                <p className="text-[10px] text-muted-foreground dark:text-slate-400 truncate">
                  {slice.transactionCount} {slice.transactionCount === 1 ? 'tx' : 'txs'}
                </p>
              </div>
            </div>

            {/* Percentage Display (STRICT RULE: NO RUPEE AMOUNT) */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span
                className="rounded-lg px-2.5 py-1 text-xs font-mono font-bold border transition-colors shadow-xs"
                style={{
                  backgroundColor: `${slice.color}20`,
                  borderColor: `${slice.color}40`,
                  color: slice.hoverColor || slice.color,
                }}
              >
                {slice.percentage}%
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
