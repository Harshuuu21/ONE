'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DashboardCategorySlice } from '../types';

interface SpendingDonutChartProps {
  slices: DashboardCategorySlice[];
  hoveredCategory: string | null;
  onHoverCategory: (categoryName: string | null) => void;
  selectedCategory: string | null;
  onSelectCategory: (categoryName: string | null) => void;
  size?: number;
}

export function SpendingDonutChart({
  slices,
  hoveredCategory,
  onHoverCategory,
  selectedCategory,
  onSelectCategory,
  size = 280,
}: SpendingDonutChartProps) {
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // Geometric parameters
  const center = size / 2;
  const radius = size * 0.34; // ~95px at 280px size
  const circumference = 2 * Math.PI * radius;
  const normalStroke = 24;
  const hoverStroke = 32;

  // Find currently active slice (hovered takes precedence, then selected)
  const activeCategoryName = hoveredCategory || selectedCategory;
  const activeSlice = slices.find((s) => s.name === activeCategoryName) || null;

  // Calculate cumulative offsets and dash lengths
  const isSingleSegment = slices.length === 1;
  const gapPx = isSingleSegment ? 0 : 6; // Separation between rounded caps

  let accumulatedPercent = 0;
  const segmentData = slices.map((slice) => {
    const fraction = slice.percentage / 100;
    const arcLength = fraction * circumference;
    const isSmall = arcLength <= normalStroke + gapPx;

    // With strokeLinecap="round", the caps add normalStroke total to the visible length
    const dashLength = isSingleSegment
      ? circumference
      : isSmall
      ? 1
      : Math.max(1, arcLength - normalStroke - gapPx);

    // Initial offset adjusted for the half-cap shift
    const startShift = isSingleSegment ? 0 : (normalStroke + gapPx) / 2;
    const offset = -((accumulatedPercent / 100) * circumference + startShift);

    accumulatedPercent += slice.percentage;

    return {
      slice,
      dashLength,
      offset,
    };
  });

  const handleMouseMove = (e: React.MouseEvent<SVGGElement>, name: string) => {
    onHoverCategory(name);
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ width: size, height: size }}
      onMouseLeave={() => {
        onHoverCategory(null);
        setTooltipPos(null);
      }}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="h-full w-full -rotate-90 transform overflow-visible"
      >
        <defs>
          {slices.map((slice) => (
            <filter
              key={`glow-${slice.id}`}
              id={`glow-${slice.id}`}
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation="6"
                floodColor={slice.glowColor}
                floodOpacity="0.8"
              />
            </filter>
          ))}
        </defs>

        {/* Background Track Ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.04)"
          strokeWidth={normalStroke}
        />

        {/* Donut Category Segments */}
        {segmentData.map(({ slice, dashLength, offset }) => {
          const isHovered = hoveredCategory === slice.name;
          const isSelected = selectedCategory === slice.name;
          const isDimmed = activeCategoryName && !isHovered && !isSelected;

          return (
            <g
              key={slice.id}
              className="cursor-pointer transition-all duration-200"
              onMouseEnter={(e) => handleMouseMove(e, slice.name)}
              onMouseMove={(e) => handleMouseMove(e, slice.name)}
              onClick={() => {
                if (selectedCategory === slice.name) {
                  onSelectCategory(null);
                } else {
                  onSelectCategory(slice.name);
                }
              }}
            >
              <motion.circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={isHovered ? slice.hoverColor : slice.color}
                strokeWidth={isHovered || isSelected ? hoverStroke : normalStroke}
                strokeLinecap="round"
                strokeDasharray={`${dashLength} ${circumference}`}
                initial={{ strokeDashoffset: circumference }}
                animate={{
                  strokeDashoffset: offset,
                  opacity: isDimmed ? 0.35 : 1,
                }}
                transition={{
                  duration: 0.9,
                  ease: [0.16, 1, 0.3, 1],
                }}
                filter={isHovered || isSelected ? `url(#glow-${slice.id})` : undefined}
                style={{
                  transition: 'stroke-width 0.2s ease, filter 0.2s ease, opacity 0.2s ease',
                }}
              />
            </g>
          );
        })}
      </svg>

      {/* Central Empty Area Information Display */}
      {/* STRICT RULE: DO NOT DISPLAY RUPEE AMOUNTS IN THE CENTER */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <AnimatePresence mode="wait">
          {activeSlice ? (
            <motion.div
              key={activeSlice.name}
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.88 }}
              transition={{ duration: 0.18 }}
              className="flex flex-col items-center px-4"
            >
              <span
                className="font-serif text-3xl md:text-4xl font-bold tracking-tight"
                style={{ color: activeSlice.color }}
              >
                {activeSlice.percentage}%
              </span>
              <span className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-300">
                {activeSlice.name}
              </span>
              <span className="text-[10px] tracking-widest text-slate-500 uppercase">
                {activeSlice.transactionCount} transactions
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="default-center"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.18 }}
              className="flex flex-col items-center px-4"
            >
              <span className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-white">
                100%
              </span>
              <span className="mt-1 text-[10px] font-semibold tracking-widest text-teal-400 uppercase">
                SPENDING DISTRIBUTION
              </span>
              <span className="mt-0.5 text-[10px] tracking-wider text-slate-500">
                {slices.length} active categories
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Clean Interactive Hover Tooltip (NO RUPEE AMOUNTS) */}
      {activeSlice && tooltipPos && (
        <div
          className="pointer-events-none absolute z-30 hidden sm:block -translate-x-1/2 -translate-y-12 rounded-xl border border-white/10 bg-slate-900/90 px-3 py-1.5 shadow-xl backdrop-blur-md"
          style={{
            left: Math.max(50, Math.min(size - 50, tooltipPos.x)),
            top: Math.max(10, Math.min(size - 30, tooltipPos.y)),
          }}
        >
          <div className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: activeSlice.color }}
            />
            <span className="text-xs font-semibold text-white">
              {activeSlice.name}
            </span>
            <span className="text-xs font-mono font-bold text-teal-300">
              {activeSlice.percentage}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
