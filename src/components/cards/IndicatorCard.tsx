"use client";

import { Indicator } from "@/lib/types";
import { getScoreColor } from "@/lib/types";
import { getCategoryBySlug } from "@/data/categories";

interface IndicatorCardProps {
  indicator: Indicator;
  onClick?: () => void;
}

export default function IndicatorCard({ indicator, onClick }: IndicatorCardProps) {
  const scoreColor = getScoreColor(indicator.score);
  const category = getCategoryBySlug(indicator.categorySlug);

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white border-2 border-foreground rounded-xl p-4 card-interactive hover:shadow-accent group"
      aria-label={`${indicator.name}: score ${indicator.score} out of 100`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0 pr-4">
          <h4 className="font-heading font-bold text-sm text-foreground truncate">
            {indicator.name}
          </h4>
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className="w-2 h-2 rounded-sm"
              style={{ backgroundColor: category?.color || "#94A3B8" }}
            />
            <span className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">
              {category?.name || indicator.categorySlug}
            </span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <span
            className="font-heading text-2xl font-extrabold tabular-nums leading-none"
            style={{ color: scoreColor }}
          >
            {indicator.score}
          </span>
          <span className="text-muted-foreground text-xs ml-0.5">/100</span>
        </div>
      </div>

      {/* Score bar */}
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-3">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${indicator.score}%`, backgroundColor: scoreColor }}
        />
      </div>

      {/* Values row */}
      <div className="flex items-center justify-between text-xs font-body">
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground">
            Current: <span className="font-medium text-foreground tabular-nums">{indicator.currentValue}{indicator.unit}</span>
          </span>
          <span className="text-muted-foreground">
            Prev: <span className="font-medium text-foreground tabular-nums">{indicator.previousValue}{indicator.unit}</span>
          </span>
        </div>
        <span
          className={`font-medium tabular-nums ${
            indicator.change > 0
              ? "text-green-600"
              : indicator.change < 0
              ? "text-red-500"
              : "text-muted-foreground"
          }`}
        >
          {indicator.change > 0 ? "+" : ""}
          {indicator.change.toFixed(1)}
        </span>
      </div>
    </button>
  );
}
