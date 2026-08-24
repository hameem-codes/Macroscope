"use client";

import { useState } from "react";
import { categories } from "@/data/categories";

interface FilterControlsProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  category: string;
  scoreRange: string;
  trend: string;
  sortBy: string;
}

const defaultFilters: FilterState = {
  category: "all",
  scoreRange: "all",
  trend: "all",
  sortBy: "score-desc",
};

const scoreRanges = [
  { value: "all", label: "All Scores" },
  { value: "0-20", label: "0–20 Critical" },
  { value: "20-40", label: "20–40 Weak" },
  { value: "40-60", label: "40–60 Neutral" },
  { value: "60-80", label: "60–80 Healthy" },
  { value: "80-100", label: "80–100 Strong" },
];

export default function FilterControls({ onFilterChange }: FilterControlsProps) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  function updateFilter(key: keyof FilterState, value: string) {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Category */}
      <select
        value={filters.category}
        onChange={(e) => updateFilter("category", e.target.value)}
        className="px-3 py-2 border-2 border-border rounded-lg text-sm font-body bg-white text-foreground focus:border-accent focus:outline-none"
        aria-label="Filter by category"
      >
        <option value="all">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.slug} value={cat.slug}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* Score Range */}
      <select
        value={filters.scoreRange}
        onChange={(e) => updateFilter("scoreRange", e.target.value)}
        className="px-3 py-2 border-2 border-border rounded-lg text-sm font-body bg-white text-foreground focus:border-accent focus:outline-none"
        aria-label="Filter by score range"
      >
        {scoreRanges.map((range) => (
          <option key={range.value} value={range.value}>
            {range.label}
          </option>
        ))}
      </select>

      {/* Trend */}
      <select
        value={filters.trend}
        onChange={(e) => updateFilter("trend", e.target.value)}
        className="px-3 py-2 border-2 border-border rounded-lg text-sm font-body bg-white text-foreground focus:border-accent focus:outline-none"
        aria-label="Filter by trend"
      >
        <option value="all">All Trends</option>
        <option value="up">↑ Improving</option>
        <option value="down">↓ Deteriorating</option>
        <option value="flat">→ Stable</option>
      </select>

      {/* Sort */}
      <select
        value={filters.sortBy}
        onChange={(e) => updateFilter("sortBy", e.target.value)}
        className="px-3 py-2 border-2 border-border rounded-lg text-sm font-body bg-white text-foreground focus:border-accent focus:outline-none"
        aria-label="Sort indicators"
      >
        <option value="score-desc">Score (High to Low)</option>
        <option value="score-asc">Score (Low to High)</option>
        <option value="change-desc">Change (Most Improved)</option>
        <option value="change-asc">Change (Most Deteriorated)</option>
        <option value="name-asc">Name (A–Z)</option>
      </select>

      {/* Reset */}
      {(filters.category !== "all" || filters.scoreRange !== "all" || filters.trend !== "all") && (
        <button
          onClick={() => {
            setFilters(defaultFilters);
            onFilterChange(defaultFilters);
          }}
          className="px-3 py-2 text-sm font-medium text-accent hover:bg-accent/10 rounded-lg transition-colors"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

export function filterIndicators<T extends { id: string; categorySlug: string; score: number; change: number; name: string; trend: string }>(
  indicators: T[],
  filters: FilterState
): T[] {
  let filtered = [...indicators];

  // Category filter
  if (filters.category !== "all") {
    filtered = filtered.filter((i) => i.categorySlug === filters.category);
  }

  // Score range filter
  if (filters.scoreRange !== "all") {
    const [min, max] = filters.scoreRange.split("-").map(Number);
    filtered = filtered.filter((i) => i.score >= min && i.score <= max);
  }

  // Trend filter
  if (filters.trend !== "all") {
    filtered = filtered.filter((i) => i.trend === filters.trend);
  }

  // Sort
  switch (filters.sortBy) {
    case "score-desc":
      filtered.sort((a, b) => b.score - a.score);
      break;
    case "score-asc":
      filtered.sort((a, b) => a.score - b.score);
      break;
    case "change-desc":
      filtered.sort((a, b) => b.change - a.change);
      break;
    case "change-asc":
      filtered.sort((a, b) => a.change - b.change);
      break;
    case "name-asc":
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  return filtered;
}
