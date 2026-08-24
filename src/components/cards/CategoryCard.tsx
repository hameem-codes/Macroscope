"use client";

import Link from "next/link";
import { CategoryConfig } from "@/lib/types";
import { getScoreColor, getScoreRange } from "@/lib/types";
import { getIndicatorsForCountry } from "@/data/indicators";
import { calculateCategoryScore } from "@/lib/calculations";

interface CategoryCardProps {
  category: CategoryConfig;
  countryId: string;
  index: number;
}

export default function CategoryCard({ category, countryId, index }: CategoryCardProps) {
  const indicators = getIndicatorsForCountry(countryId);
  const catScore = calculateCategoryScore(indicators, category.slug);
  const scoreColor = getScoreColor(catScore.score);
  const range = getScoreRange(catScore.score);

  return (
    <Link
      href={`/category/${category.slug}`}
      className={`
        block relative bg-white border-2 border-foreground rounded-xl p-5
        card-interactive opacity-0 animate-pop-in stagger-${index + 1}
        overflow-hidden group
      `}
    >
      {/* Geometric accent */}
      <div
        className="absolute -top-3 -right-3 w-12 h-12 rotate-45 opacity-20 group-hover:opacity-40 transition-opacity"
        style={{ backgroundColor: category.color }}
      />
      <div
        className="absolute bottom-0 left-0 w-full h-1 opacity-60"
        style={{ backgroundColor: category.color }}
      />

      {/* Content */}
      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">{category.icon}</span>
            <span className="text-[10px] uppercase tracking-[0.12em] font-heading font-bold text-muted-foreground">
              {category.name}
            </span>
          </div>
          <svg
            className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" />
          </svg>
        </div>

        {/* Score */}
        <div className="mb-3">
          <span
            className="font-heading text-3xl font-extrabold tabular-nums"
            style={{ color: scoreColor }}
          >
            {catScore.score}
          </span>
          <span className="text-muted-foreground text-sm ml-1">/ 100</span>
        </div>

        {/* Change */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`text-sm font-body font-medium ${
              catScore.change > 0
                ? "text-green-600"
                : catScore.change < 0
                ? "text-red-500"
                : "text-muted-foreground"
            }`}
          >
            {catScore.change > 0 ? "↑ +" : catScore.change < 0 ? "↓ " : "→ "}
            {Math.abs(catScore.change).toFixed(1)}
          </span>
        </div>

        {/* Interpretation */}
        <p className="text-xs text-muted-foreground font-body leading-relaxed mb-3 line-clamp-2">
          {catScore.interpretation}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-heading font-bold">
            {indicators.filter((i) => i.categorySlug === category.slug).length} indicators
          </span>
          <span
            className="text-[10px] font-heading font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border"
            style={{ borderColor: scoreColor, color: scoreColor, backgroundColor: `${scoreColor}10` }}
          >
            {range}
          </span>
        </div>
      </div>
    </Link>
  );
}
