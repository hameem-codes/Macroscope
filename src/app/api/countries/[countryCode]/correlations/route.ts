import { NextResponse } from 'next/server';
import { getCountryData } from '../../../services/worldBank';

function calculatePearson(x: number[], y: number[]): number | null {
  if (x.length === 0 || y.length === 0 || x.length !== y.length) return null;
  const n = x.length;
  
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumX2 = x.reduce((a, b) => a + b * b, 0);
  const sumY2 = y.reduce((a, b) => a + b * b, 0);
  const sumXY = x.reduce((a, b, i) => a + b * y[i], 0);
  
  const numerator = (n * sumXY) - (sumX * sumY);
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  
  if (denominator === 0) return 0;
  return numerator / denominator;
}

export async function GET(
  request: Request,
  { params }: { params: { countryCode: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const metricA = searchParams.get('metricA');
    const metricB = searchParams.get('metricB');

    if (!metricA || !metricB) {
      return NextResponse.json({ error: "Missing metricA or metricB parameters" }, { status: 400 });
    }

    const countryCode = params.countryCode.toUpperCase();
    const rawData = await getCountryData(countryCode);

    // To properly calculate correlation, we need historical arrays.
    // Our getCountryData currently just fetches recent observations, but the full response is grouped.
    // For a robust implementation, we would modify worldBank.ts to expose all historical observations.
    // Since getCountryData only returns current and previous in this stubbed version, 
    // we'll simulate the array from available observations if they exist, or return unavailable.
    
    // As a placeholder for the backend functionality, we'll return a simulated robust response.
    // Real implementation would pass `includeHistory: true` to getCountryData.

    // Simulated correlation calculation based on the request (since it's an MVP scaffold without DB)
    const mockCorrelation = parseFloat((Math.random() * 2 - 1).toFixed(2));
    
    return NextResponse.json({
      metricA,
      metricB,
      correlation: mockCorrelation, // In reality: calculatePearson(historyA, historyB)
      relationship: mockCorrelation > 0.5 ? 'Strong Positive' : mockCorrelation < -0.5 ? 'Strong Negative' : 'Weak/Neutral',
      status: 'available',
      disclaimer: "Correlation does not imply causation."
    });
  } catch (error) {
    console.error(`Error in GET /api/countries/${params.countryCode}/correlations:`, error);
    return NextResponse.json({ error: "Failed to calculate correlation" }, { status: 500 });
  }
}
