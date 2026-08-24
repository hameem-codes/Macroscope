"use client";

import { Indicator } from "@/lib/types";
import { getScoreColor } from "@/lib/types";
import { getCategoryBySlug } from "@/data/categories";

interface TopMoversProps {
  indicators: Indicator[];
}

export default function TopMovers({ indicators }: TopMoversProps) {
  const sorted = [...indicators].sort((a, b) => b.change - a.change);
  const improving = sorted.slice(0, 5);
  const deteriorating = sorted.slice(-5).reverse();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Improving */}
      <div className="bg-white border-2 border-foreground rounded-xl p-5 relative overflow-hidden">
        <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full bg-quaternary/10" />
        <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-foreground mb-4 flex items-center gap-2">
          <span className="text-quaternary text-lg">↑</span>
          Most Improved
        </h3>
        <div className="space-y-3">
          {improving.map((ind, i) => {
            const cat = getCategoryBySlug(ind.categorySlug);
            return (
              <div
                key={ind.id}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-muted-foreground text-xs font-heading font-bold w-5">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium font-body text-foreground truncate">
                      {ind.name}
                    </p>
                    <span className="text-[10px] text-muted-foreground">{cat?.name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="font-heading font-bold tabular-nums text-sm" style={{ color: getScoreColor(ind.score) }}>
                    {ind.score}
                  </span>
                  <span className="text-green-600 text-xs font-medium tabular-nums">
                    +{ind.change.toFixed(1)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deteriorating */}
      <div className="bg-white border-2 border-foreground rounded-xl p-5 relative overflow-hidden">
        <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full bg-red-500/10" />
        <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-foreground mb-4 flex items-center gap-2">
          <span className="text-red-500 text-lg">↓</span>
          Most Deteriorated
        </h3>
        <div className="space-y-3">
          {deteriorating.map((ind, i) => {
            const cat = getCategoryBySlug(ind.categorySlug);
            return (
              <div
                key={ind.id}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-muted-foreground text-xs font-heading font-bold w-5">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium font-body text-foreground truncate">
                      {ind.name}
                    </p>
                    <span className="text-[10px] text-muted-foreground">{cat?.name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="font-heading font-bold tabular-nums text-sm" style={{ color: getScoreColor(ind.score) }}>
                    {ind.score}
                  </span>
                  <span className="text-red-500 text-xs font-medium tabular-nums">
                    {ind.change.toFixed(1)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
