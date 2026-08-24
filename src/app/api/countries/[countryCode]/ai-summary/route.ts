import { NextResponse } from 'next/server';
import { generateExecutiveSummary } from '../../../services/groq';
import { processCountryData, calculateCategoryScores, calculateEconomyHealthScore } from '../../../services/scoringService';
import { getScoreRange, getScoreLabel } from '@/lib/types';

export async function GET(
  request: Request,
  { params }: { params: { countryCode: string } }
) {
  try {
    const countryCode = params.countryCode.toUpperCase();
    
    // We need the health data to generate the summary
    const indicators = await processCountryData(countryCode);
    const rawCategoryScores = calculateCategoryScores(indicators);
    
    const categoryScores = rawCategoryScores.map((cat: any) => ({
      categorySlug: cat.categorySlug,
      score: cat.score,
      change: 0,
      interpretation: getScoreLabel(cat.score),
    }));

    const economyHealthScore = calculateEconomyHealthScore(categoryScores);
    
    const healthData = {
      countryId: countryCode,
      overallScore: economyHealthScore,
      previousScore: economyHealthScore,
      overallChange: 0,
      status: getScoreRange(economyHealthScore),
      interpretation: getScoreLabel(economyHealthScore),
      categoryScores,
      historicalScores: []
    };

    const summaryResponse = await generateExecutiveSummary(healthData);

    return NextResponse.json(summaryResponse);
  } catch (error) {
    console.error(`Error in GET /api/countries/${params.countryCode}/ai-summary:`, error);
    return NextResponse.json({ error: "Failed to generate AI summary" }, { status: 500 });
  }
}
