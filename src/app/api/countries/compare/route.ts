import { NextResponse } from 'next/server';
import { processCountryData, calculateCategoryScores, calculateEconomyHealthScore } from '../../services/scoringService';
import { getScoreRange, getScoreLabel } from '@/lib/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const countriesParam = searchParams.get('countries');
    
    if (!countriesParam) {
      return NextResponse.json({ error: "Missing countries parameter (comma separated)" }, { status: 400 });
    }

    const countryCodes = countriesParam.split(',').map(c => c.trim().toUpperCase());
    
    if (countryCodes.length < 2 || countryCodes.length > 4) {
      return NextResponse.json({ error: "Please provide between 2 and 4 country codes for comparison." }, { status: 400 });
    }

    // Fetch data for all countries in parallel
    const comparisonResults = await Promise.all(
      countryCodes.map(async (code) => {
        try {
          const indicators = await processCountryData(code);
          const rawCategoryScores = calculateCategoryScores(indicators);
          const categoryScores = rawCategoryScores.map(cat => ({
            categorySlug: cat.categorySlug,
            score: cat.score,
            change: 0,
            interpretation: getScoreLabel(cat.score),
          }));
          const economyHealthScore = calculateEconomyHealthScore(categoryScores);
          
          return {
            countryCode: code,
            economyHealthScore,
            status: getScoreRange(economyHealthScore),
            categoryScores,
            indicators
          };
        } catch (err) {
          console.error(`Failed to process data for ${code}`, err);
          return null;
        }
      })
    );

    // Filter out failed fetching
    const validResults = comparisonResults.filter(res => res !== null);

    return NextResponse.json({
      comparison: validResults
    });
  } catch (error) {
    console.error("Error in GET /api/countries/compare:", error);
    return NextResponse.json({ error: "Failed to compare countries" }, { status: 500 });
  }
}
