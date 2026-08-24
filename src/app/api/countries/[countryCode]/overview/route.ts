import { NextResponse } from 'next/server';
import { processCountryData, calculateCategoryScores, calculateEconomyHealthScore } from '../../../services/scoringService';
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
    
    // Format category scores for frontend
    const categoryScores = rawCategoryScores.map((cat: { categorySlug: string; score: number }) => ({
      categorySlug: cat.categorySlug,
      score: cat.score,
      change: 0, // we need historical category scores for this, default 0 for now
      interpretation: getScoreLabel(cat.score),
    }));

    // Calculate overall health score
    const economyHealthScore = calculateEconomyHealthScore(categoryScores);
    
    const response = {
      countryCode,
      indicators,
      categoryScores,
      economyHealthScore,
      indicatorCount: indicators.length,
      status: getScoreRange(economyHealthScore),
      interpretation: getScoreLabel(economyHealthScore),
      // Dummy historical scores for the trend chart, ideally fetched from historical data
      historicalScores: [
        { month: "Jan", score: Math.max(0, economyHealthScore - 2) },
        { month: "Feb", score: Math.max(0, economyHealthScore - 1) },
        { month: "Mar", score: economyHealthScore },
      ]
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error(`Error in GET /api/countries/${params.countryCode}/overview:`, error);
    return NextResponse.json({ error: "Failed to fetch overview data" }, { status: 500 });
  }
}
