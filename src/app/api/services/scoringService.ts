import { getCountryData, getRawCountryData, WBIndicatorData } from "./worldBank";
import { allProviderIndicators, Direction } from "./indicatorsMapping";
import { Indicator } from "@/lib/types";
import { getCountryById } from "@/data/countries";

export function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function normalizeValue(value: number, min: number, max: number, direction: Direction): number {
  if (min >= max) return 50; // Guard against bad config

  let score = 0;
  if (direction === "higher_is_better") {
    score = ((value - min) / (max - min)) * 100;
  } else if (direction === "lower_is_better") {
    score = ((max - value) / (max - min)) * 100;
  } else if (direction === "neutral") {
    const mid = (max + min) / 2;
    const range = (max - min) / 2;
    const dist = Math.abs(value - mid);
    score = ((range - dist) / range) * 100;
  }

  return clampScore(score);
}

export async function processCountryData(countryCode: string): Promise<Indicator[]> {
  const country = getCountryById(countryCode);
  const wbCode = country?.worldBankCode || countryCode;
  const rawData = await getCountryData(wbCode);
  
  return rawData.map(({ mapping, currentObservation, previousObservation }) => {
    const currentValue = currentObservation.value ?? 0;
    const previousValue = previousObservation?.value ?? currentValue;
    
    const score = normalizeValue(currentValue, mapping.min, mapping.max, mapping.direction);
    
    // Calculate change
    let change = 0;
    if (previousValue !== 0) {
       change = currentValue - previousValue; // absolute change for rates
    }

    const trend = change > 0 ? "up" : change < 0 ? "down" : "flat";

    return {
      id: mapping.id,
      name: mapping.name,
      categorySlug: mapping.categorySlug,
      score,
      currentValue: Math.round(currentValue * 100) / 100,
      previousValue: Math.round(previousValue * 100) / 100,
      change: Math.round(change * 100) / 100,
      trend,
      unit: mapping.unit,
      description: mapping.description,
      updateFrequency: `Annual (Last: ${currentObservation.date})`,
      source: mapping.source,
    };
  });
}

export function calculateCategoryScores(indicators: { categorySlug: string; score: number }[]) {
  const categoryMap = new Map<string, { totalScore: number; count: number }>();

  indicators.forEach(ind => {
    const existing = categoryMap.get(ind.categorySlug) || { totalScore: 0, count: 0 };
    categoryMap.set(ind.categorySlug, {
      totalScore: existing.totalScore + ind.score,
      count: existing.count + 1
    });
  });

  const categoryScores: { categorySlug: string; score: number }[] = [];
  
  categoryMap.forEach((val, slug) => {
    categoryScores.push({
      categorySlug: slug,
      score: clampScore(val.totalScore / val.count)
    });
  });

  return categoryScores;
}

export function calculateEconomyHealthScore(categoryScores: { score: number }[]): number {
  if (categoryScores.length === 0) return 0;
  const total = categoryScores.reduce((sum, cat) => sum + cat.score, 0);
  return clampScore(total / categoryScores.length);
}

export async function calculateHistoricalScoresForCountry(countryIso3Code: string) {
  const rawData = await getRawCountryData(countryIso3Code);
  const wbIndicators = allProviderIndicators.filter(i => i.source === "World Bank");

  // Group observations by mapping ID (wbIndicator.id)
  const groupedByMappingId = new Map<string, WBIndicatorData[]>();
  rawData.forEach(obs => {
    const mapping = wbIndicators.find(m => m.sourceIndicatorId === obs.indicator.id);
    if (mapping && obs.value !== null) {
      const existing = groupedByMappingId.get(mapping.id) || [];
      existing.push(obs);
      groupedByMappingId.set(mapping.id, existing);
    }
  });

  const years = ["2020", "2021", "2022", "2023", "2024"];

  const yearlyData = years.map(yearStr => {
    const yearInt = parseInt(yearStr);
    
    // Calculate indicators for this year
    const indicatorsForYear: { categorySlug: string; score: number }[] = [];
    
    wbIndicators.forEach(mapping => {
      const obsList = groupedByMappingId.get(mapping.id) || [];
      
      // Filter observations up to this year
      const priorObs = obsList.filter(obs => parseInt(obs.date) <= yearInt);
      
      let val: number | null = null;
      if (priorObs.length > 0) {
        priorObs.sort((a, b) => parseInt(b.date) - parseInt(a.date));
        val = priorObs[0].value;
      } else if (obsList.length > 0) {
        // Fallback: if no observation is available before/at this year, use the earliest observation
        const sortedObs = [...obsList].sort((a, b) => parseInt(a.date) - parseInt(b.date));
        val = sortedObs[0].value;
      }
      
      if (val !== null) {
        const score = normalizeValue(val, mapping.min, mapping.max, mapping.direction);
        indicatorsForYear.push({
          categorySlug: mapping.categorySlug,
          score
        });
      }
    });
    
    // Group and calculate category scores for this year
    const categoryScores = calculateCategoryScores(indicatorsForYear);
    
    // Calculate overall score for this year
    const overallScore = calculateEconomyHealthScore(categoryScores);
    
    return {
      yearStr,
      overallScore,
      categoryScores
    };
  });

  const historicalScores = yearlyData.map(d => ({
    month: d.yearStr,
    score: d.overallScore
  }));

  const historicalCategoryScores: Record<string, { month: string; score: number }[]> = {};
  
  const slugs = Array.from(new Set(wbIndicators.map(i => i.categorySlug)));
  slugs.forEach(slug => {
    historicalCategoryScores[slug] = [];
  });
  
  yearlyData.forEach(d => {
    d.categoryScores.forEach(cs => {
      if (historicalCategoryScores[cs.categorySlug]) {
        historicalCategoryScores[cs.categorySlug].push({
          month: d.yearStr,
          score: cs.score
        });
      }
    });
  });

  return {
    historicalScores,
    historicalCategoryScores
  };
}

