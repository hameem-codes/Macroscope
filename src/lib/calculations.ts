import {
  Indicator,
  CategoryScore,
  CountryHealthData,
  ScoreRange,
  getScoreRange,
  getScoreLabel,
} from "@/lib/types";
import { categories } from "@/data/categories";
import { getIndicatorsForCountry } from "@/data/indicators";

export function calculateCategoryScore(
  indicators: Indicator[],
  categorySlug: string
): CategoryScore {
  const catIndicators = indicators.filter(
    (i) => i.categorySlug === categorySlug
  );
  if (catIndicators.length === 0) {
    return { categorySlug, score: 0, change: 0, interpretation: "No data available." };
  }
  const score = Math.round(
    catIndicators.reduce((sum, i) => sum + i.score, 0) / catIndicators.length
  );
  const change =
    Math.round(
      (catIndicators.reduce((sum, i) => sum + i.change, 0) /
        catIndicators.length) *
        10
    ) / 10;

  return {
    categorySlug,
    score,
    change,
    interpretation: generateInterpretation(score, categorySlug),
  };
}

export function calculateOverallScore(
  categoryScores: CategoryScore[]
): number {
  if (categoryScores.length === 0) return 0;
  // Equal weights
  return Math.round(
    categoryScores.reduce((sum, c) => sum + c.score, 0) /
      categoryScores.length
  );
}

export function getCountryHealthData(countryId: string): CountryHealthData {
  const indicators = getIndicatorsForCountry(countryId);
  const categoryScores = categories.map((cat) =>
    calculateCategoryScore(indicators, cat.slug)
  );
  const overallScore = calculateOverallScore(categoryScores);
  const previousScore = Math.round(overallScore * 0.96); // simulated previous
  const overallChange = Math.round((overallScore - previousScore) * 10) / 10;

  return {
    countryId,
    overallScore,
    previousScore,
    overallChange,
    status: getScoreRange(overallScore),
    interpretation: generateOverallInterpretation(categoryScores),
    categoryScores,
    historicalScores: generateHistoricalScores(countryId),
  };
}

export function getIndicatorsForCategory(
  countryId: string,
  categorySlug: string
): Indicator[] {
  return getIndicatorsForCountry(countryId).filter(
    (i) => i.categorySlug === categorySlug
  );
}

function generateInterpretation(score: number, categorySlug: string): string {
  const catName =
    categories.find((c) => c.slug === categorySlug)?.name || "this category";
  const range = getScoreRange(score);
  const interpretations: Record<ScoreRange, string> = {
    critical: `${catName} conditions are critical and require immediate attention.`,
    weak: `${catName} indicators show weakness with room for improvement.`,
    neutral: `${catName} conditions are stable but mixed.`,
    healthy: `${catName} indicators are broadly healthy and supportive.`,
    strong: `${catName} conditions are strong with broad-based improvement.`,
  };
  return interpretations[range];
}

function generateOverallInterpretation(
  categoryScores: CategoryScore[]
): string {
  const strongest = [...categoryScores].sort((a, b) => b.score - a.score)[0];
  const weakest = [...categoryScores].sort((a, b) => a.score - b.score)[0];
  const strongCat = categories.find(
    (c) => c.slug === strongest?.categorySlug
  );
  const weakCat = categories.find(
    (c) => c.slug === weakest?.categorySlug
  );

  return `Strong ${strongCat?.name.toLowerCase() || "conditions"} and ${getScoreRange(strongest?.score || 0) === "strong" || getScoreRange(strongest?.score || 0) === "healthy" ? "resilient" : "mixed"} indicators are ${getScoreRange(strongest?.score || 0) === "strong" || getScoreRange(strongest?.score || 0) === "healthy" ? "supporting" : "characterizing"} the economy, while ${weakCat?.name.toLowerCase() || "some areas"} remains a key area to watch.`;
}

function generateHistoricalScores(
  countryId: string
): { month: string; score: number }[] {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  // Generate plausible 12-month history
  const baseScores: Record<string, number[]> = {
    us: [72, 73, 71, 74, 75, 74, 76, 78, 77, 79, 78, 78],
    in: [66, 67, 68, 69, 70, 71, 72, 72, 73, 74, 72, 72],
    cn: [62, 61, 60, 62, 63, 64, 63, 64, 65, 64, 64, 64],
    de: [67, 66, 65, 66, 67, 68, 69, 68, 69, 68, 69, 69],
    gb: [64, 63, 62, 63, 64, 65, 66, 65, 66, 65, 66, 66],
    jp: [62, 61, 60, 61, 62, 63, 64, 63, 64, 65, 66, 66],
    fr: [64, 63, 62, 63, 64, 65, 66, 67, 66, 67, 68, 68],
    ca: [68, 67, 66, 67, 68, 69, 70, 69, 70, 71, 70, 70],
    au: [68, 67, 66, 67, 68, 69, 70, 69, 70, 71, 72, 72],
    br: [58, 57, 56, 58, 60, 62, 63, 62, 63, 64, 64, 64],
  };

  return months.map((month, i) => ({
    month,
    score: (baseScores[countryId] || baseScores.us)[i],
  }));
}
