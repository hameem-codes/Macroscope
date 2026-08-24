"use client";

import React from "react";
import ScoreBadge from "@/components/cards/ScoreBadge";
import TrendChart from "@/components/charts/TrendChart";
import { Indicator, CategoryConfig } from "@/lib/types";

interface IndicatorDetailModalProps {
  indicator: Indicator;
  category: CategoryConfig;
  onClose: () => void;
}

export default function IndicatorDetailModal({
  indicator,
  category,
  onClose,
}: IndicatorDetailModalProps) {
  // Generate mock historical data
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 search-overlay"
      onClick={onClose}
    >
      <div
        className="bg-white border-2 border-foreground rounded-xl shadow-hard-lg max-w-lg w-full max-h-[85vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={`${indicator.name} detail`}
      >
        {/* Close */}
        <div className="flex items-center justify-between mb-4">
          <span
            className="text-[10px] uppercase tracking-wider font-heading font-bold px-2 py-1 rounded-full border"
            style={{ borderColor: category.color, color: category.color }}
          >
            {category.name}
          </span>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-muted rounded-lg transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>

        {/* Name & Score */}
        <h3 className="font-heading text-xl font-extrabold text-foreground mb-3">{indicator.name}</h3>
        <div className="flex items-center gap-4 mb-4">
          <ScoreBadge score={indicator.score} size="lg" />
        </div>

        {/* Values */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-muted rounded-lg p-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-heading font-bold">Current</p>
            <p className="font-heading text-lg font-bold text-foreground tabular-nums">
              {indicator.currentValue}{indicator.unit}
            </p>
          </div>
          <div className="bg-muted rounded-lg p-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-heading font-bold">Previous</p>
            <p className="font-heading text-lg font-bold text-muted-foreground tabular-nums">
              {indicator.previousValue}{indicator.unit}
            </p>
          </div>
        </div>

        {/* Change */}
        <div className="mb-6">
          <p className={`text-sm font-body font-medium ${
            indicator.change > 0 ? "text-green-600" : indicator.change < 0 ? "text-red-500" : "text-muted-foreground"
          }`}>
            Change: {indicator.change > 0 ? "+" : ""}{indicator.change.toFixed(1)} points
          </p>
        </div>

        {/* Mini trend */}
        <div className="mb-6">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-heading font-bold mb-2">
            12-Month Score History
          </p>
          <div className="bg-muted rounded-lg p-4">
            <TrendChart
              data={months.map((m, i) => ({
                month: m,
                score: Math.max(0, Math.min(100, Math.round(indicator.score - 10 + Math.sin(i * 0.9) * 8 + i * 0.4))),
              }))}
              color={category.color}
              height={140}
              label={`${indicator.name} score history`}
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-heading font-bold mb-1">Description</p>
          <p className="text-sm text-muted-foreground font-body">{indicator.description}</p>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground font-body border-t border-border pt-4">
          <span>Update: {indicator.updateFrequency}</span>
          <span>Source: {indicator.source}</span>
        </div>
      </div>
    </div>
  );
}
