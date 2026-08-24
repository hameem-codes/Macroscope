export type ScoreRange = "critical" | "weak" | "neutral" | "healthy" | "strong";

export type TrendDirection = "up" | "down" | "flat";

export interface CategoryConfig {
  id: string;
  name: string;
  slug: string;
  color: string;
  shadowColor: string;
  icon: string;
  description: string;
}

export interface Indicator {
  id: string;
  name: string;
  categorySlug: string;
  score: number;
  currentValue: number;
  previousValue: number;
  change: number;
  trend: TrendDirection;
  unit: string;
  description: string;
  updateFrequency: string;
  source: string;
}

export interface CountryData {
  id: string;
  name: string;
  flag: string;
  code: string;
}

export interface CategoryScore {
  categorySlug: string;
  score: number;
  change: number;
  interpretation: string;
}

export interface CountryHealthData {
  countryId: string;
  overallScore: number;
  previousScore: number;
  overallChange: number;
  status: ScoreRange;
  interpretation: string;
  categoryScores: CategoryScore[];
  historicalScores: { month: string; score: number }[];
}

export interface TrendData {
  indicatorId: string;
  indicatorName: string;
  categorySlug: string;
  scores: { period: string; score: number }[];
}

export function getScoreRange(score: number): ScoreRange {
  if (score <= 20) return "critical";
  if (score <= 40) return "weak";
  if (score <= 60) return "neutral";
  if (score <= 80) return "healthy";
  return "strong";
}

export function getScoreLabel(score: number): string {
  const range = getScoreRange(score);
  return range.charAt(0).toUpperCase() + range.slice(1);
}

export function getScoreColor(score: number): string {
  if (score <= 20) return "#EF4444";
  if (score <= 40) return "#F97316";
  if (score <= 60) return "#EAB308";
  if (score <= 80) return "#22C55E";
  return "#10B981";
}

export function getScoreBgClass(score: number): string {
  if (score <= 20) return "bg-red-100 text-red-800";
  if (score <= 40) return "bg-orange-100 text-orange-800";
  if (score <= 60) return "bg-yellow-100 text-yellow-800";
  if (score <= 80) return "bg-green-100 text-green-800";
  return "bg-emerald-100 text-emerald-800";
}
