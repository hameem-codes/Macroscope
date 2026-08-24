import { NextResponse } from 'next/server';
import { processCountryData } from '../../../services/scoringService';

export async function GET(
  request: Request,
  { params }: { params: { countryCode: string } }
) {
  try {
    const countryCode = params.countryCode.toUpperCase();
    const indicators = await processCountryData(countryCode);

    // Calculate Market Health Score
    // Combine 2-3 relevant financial/business indicators: e.g. GDP Growth, Industrial Production, Market Cap
    const marketHealthIndicators = indicators.filter(i => 
      ['gdp-growth', 'industry-value-added-growth', 'market-cap-gdp'].includes(i.id)
    );
    
    const marketHealthScore = marketHealthIndicators.length > 0
      ? marketHealthIndicators.reduce((sum, i) => sum + i.score, 0) / marketHealthIndicators.length
      : null;

    // Calculate Inflation Impact Score
    // Combine CPI Inflation, GDP Deflator, Lending Interest Rate
    const inflationIndicators = indicators.filter(i => 
      ['cpi-inflation', 'gdp-deflator', 'lending-interest-rate'].includes(i.id)
    );

    const inflationImpactScore = inflationIndicators.length > 0
      ? inflationIndicators.reduce((sum, i) => sum + i.score, 0) / inflationIndicators.length
      : null;

    // Calculate Labor Market Strength Score
    // Combine Unemployment, Participation
    const laborIndicators = indicators.filter(i => 
      ['unemployment-rate', 'labor-force-participation', 'employment-to-population'].includes(i.id)
    );

    const laborMarketScore = laborIndicators.length > 0
      ? laborIndicators.reduce((sum, i) => sum + i.score, 0) / laborIndicators.length
      : null;

    return NextResponse.json({
      metrics: [
        {
          id: 'market-health',
          name: 'Market Health Score',
          score: marketHealthScore !== null ? Math.round(marketHealthScore) : null,
          status: marketHealthScore !== null ? 'available' : 'unavailable',
          methodology: 'Averages GDP Growth, Industrial Production, and Market Capitalization scores.',
          contributingIndicators: marketHealthIndicators.map(i => i.name)
        },
        {
          id: 'inflation-impact',
          name: 'Inflation & Rate Impact',
          score: inflationImpactScore !== null ? Math.round(inflationImpactScore) : null,
          status: inflationImpactScore !== null ? 'available' : 'unavailable',
          methodology: 'Averages CPI, GDP Deflator, and Lending Interest Rate scores.',
          contributingIndicators: inflationIndicators.map(i => i.name)
        },
        {
          id: 'labor-strength',
          name: 'Labor Market Strength',
          score: laborMarketScore !== null ? Math.round(laborMarketScore) : null,
          status: laborMarketScore !== null ? 'available' : 'unavailable',
          methodology: 'Averages Unemployment Rate and Labor Force Participation scores.',
          contributingIndicators: laborIndicators.map(i => i.name)
        }
      ]
    });
  } catch (error) {
    console.error(`Error in GET /api/countries/${params.countryCode}/metrics:`, error);
    return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 });
  }
}
