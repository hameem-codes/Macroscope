"use client";

import { useEffect, useState } from "react";
import { getScoreColor } from "@/lib/types";

interface ScoreBarProps {
  score: number;
  label: string;
  change?: number;
  color?: string;
  height?: number;
  animated?: boolean;
}

export default function ScoreBar({
  score,
  label,
  change,
  color,
  height = 8,
  animated = true,
}: ScoreBarProps) {
  const [width, setWidth] = useState(animated ? 0 : score);
  const barColor = color || getScoreColor(score);

  useEffect(() => {
    if (!animated) {
      setWidth(score);
      return;
    }
    const timer = setTimeout(() => setWidth(score), 100);
    return () => clearTimeout(timer);
  }, [score, animated]);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium font-body text-foreground truncate pr-4">
          {label}
        </span>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-sm font-heading font-bold tabular-nums" style={{ color: barColor }}>
            {score}
          </span>
          {change !== undefined && (
            <span
              className={`text-xs font-body ${
                change > 0
                  ? "text-green-600"
                  : change < 0
                  ? "text-red-500"
                  : "text-muted-foreground"
              }`}
            >
              {change > 0 ? "+" : ""}
              {change.toFixed(1)}
            </span>
          )}
        </div>
      </div>
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height, backgroundColor: `${barColor}15` }}
      >
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${width}%`,
            backgroundColor: barColor,
          }}
        />
      </div>
    </div>
  );
}
