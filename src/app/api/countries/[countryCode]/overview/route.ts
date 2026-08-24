import { NextResponse } from 'next/server';
import { processCountryData, calculateCategoryScores, calculateEconomyHealthScore, calculateHistoricalScoresForCountry } from '../../../services/scoringService';
import { getScoreRange, getScoreLabel } from '@/lib/types';

export async function GET(
  request: Request,
  { params }: { params: { countryCode: string } }
) {
  try {
    const countryCode = params.countryCode.toUpperCase();
    
    // Fetch and normalize indicators
    const indicators = await processCountryData(countryCode);
    
    // Calculate category scores
    const rawCategoryScores = calculateCategoryScores(indicators);
    
    // Fetch actual historical scores from World Bank data
    const { historicalScores, historicalCategoryScores } = await calculateHistoricalScoresForCountry(countryCode);

    // Format category scores for frontend
    const categoryScores = rawCategoryScores.map((cat: { categorySlug: string; score: number }) => {
      const histList = historicalCategoryScores[cat.categorySlug] || [];
      const prevYearScoreObj = histList.find(h => h.month === "2023");
      const prevYearScore = prevYearScoreObj ? prevYearScoreObj.score : cat.score;
      const change = cat.score - prevYearScore;

      return {
        categorySlug: cat.categorySlug,
        score: cat.score,
        change: Math.round(change * 10) / 10,
        interpretation: getScoreLabel(cat.score),
      };
    });

    // Calculate overall health score
    const economyHealthScore = calculateEconomyHealthScore(categoryScores);
    
    const prevOverallScoreObj = historicalScores.find(h => h.month === "2023");
    const previousScore = prevOverallScoreObj ? prevOverallScoreObj.score : economyHealthScore;
    
    const response = {
      countryCode,
      indicators,
      categoryScores,
      economyHealthScore,
      previousScore,
      indicatorCount: indicators.length,
      status: getScoreRange(economyHealthScore),
      interpretation: getScoreLabel(economyHealthScore),
      historicalScores,
      historicalCategoryScores
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error(`Error in GET /api/countries/${params.countryCode}/overview:`, error);
    return NextResponse.json({ error: "Failed to fetch overview data" }, { status: 500 });
  }
}
