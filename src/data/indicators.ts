import { Indicator } from "@/lib/types";

export interface IndicatorDefinition {
  id: string;
  name: string;
  categorySlug: string;
  currentValue: number;
  previousValue: number;
  unit: string;
  description: string;
  updateFrequency: string;
  source: string;
  baseScore: number;
}

export const indicatorDefinitions: IndicatorDefinition[] = [
  // ── Labor & Income (7) ──
  { id: "unemployment-rate", name: "Unemployment Rate", categorySlug: "labor-income", currentValue: 4.1, previousValue: 4.3, unit: "%", description: "Percentage of the labor force that is unemployed and actively seeking work.", updateFrequency: "Monthly", source: "Bureau of Labor Statistics (Sample)", baseScore: 82 },
  { id: "employment-growth", name: "Employment Growth", categorySlug: "labor-income", currentValue: 2.1, previousValue: 1.8, unit: "% YoY", description: "Year-over-year growth rate of total nonfarm employment.", updateFrequency: "Monthly", source: "BLS (Sample)", baseScore: 78 },
  { id: "labor-force-participation", name: "Labor Force Participation", categorySlug: "labor-income", currentValue: 62.8, previousValue: 62.6, unit: "%", description: "Percentage of working-age population that is in the labor force.", updateFrequency: "Monthly", source: "BLS (Sample)", baseScore: 68 },
  { id: "wage-growth", name: "Wage Growth", categorySlug: "labor-income", currentValue: 4.2, previousValue: 3.8, unit: "% YoY", description: "Year-over-year growth of average hourly earnings.", updateFrequency: "Monthly", source: "BLS (Sample)", baseScore: 76 },
  { id: "real-wage-growth", name: "Real Wage Growth", categorySlug: "labor-income", currentValue: 1.1, previousValue: 0.7, unit: "% YoY", description: "Wage growth adjusted for inflation.", updateFrequency: "Monthly", source: "BLS (Sample)", baseScore: 72 },
  { id: "initial-jobless-claims", name: "Initial Jobless Claims", categorySlug: "labor-income", currentValue: 215, previousValue: 230, unit: "K", description: "Weekly number of new unemployment insurance claims.", updateFrequency: "Weekly", source: "DOL (Sample)", baseScore: 84 },
  { id: "employment-to-population", name: "Employment-to-Population Ratio", categorySlug: "labor-income", currentValue: 60.4, previousValue: 60.1, unit: "%", description: "Percentage of working-age population that is employed.", updateFrequency: "Monthly", source: "BLS (Sample)", baseScore: 70 },

  // ── Consumer Activity (7) ──
  { id: "consumer-spending", name: "Consumer Spending", categorySlug: "consumer-activity", currentValue: 3.2, previousValue: 2.8, unit: "% QoQ", description: "Quarterly growth rate of personal consumption expenditures.", updateFrequency: "Quarterly", source: "BEA (Sample)", baseScore: 84 },
  { id: "retail-sales", name: "Retail Sales", categorySlug: "consumer-activity", currentValue: 0.6, previousValue: 0.3, unit: "% MoM", description: "Month-over-month change in total retail sales.", updateFrequency: "Monthly", source: "Census Bureau (Sample)", baseScore: 78 },
  { id: "consumer-confidence", name: "Consumer Confidence Index", categorySlug: "consumer-activity", currentValue: 114.8, previousValue: 110.2, unit: "Index", description: "Conference Board Consumer Confidence Index.", updateFrequency: "Monthly", source: "Conference Board (Sample)", baseScore: 76 },
  { id: "personal-savings-rate", name: "Personal Savings Rate", categorySlug: "consumer-activity", currentValue: 4.6, previousValue: 4.2, unit: "%", description: "Personal saving as a percentage of disposable income.", updateFrequency: "Monthly", source: "BEA (Sample)", baseScore: 62 },
  { id: "credit-card-delinquency", name: "Credit Card Delinquency Rate", categorySlug: "consumer-activity", currentValue: 2.6, previousValue: 2.8, unit: "%", description: "Percentage of credit card accounts 90+ days past due.", updateFrequency: "Quarterly", source: "Fed (Sample)", baseScore: 70 },
  { id: "auto-sales", name: "Auto Sales", categorySlug: "consumer-activity", currentValue: 15.8, previousValue: 15.2, unit: "M SAAR", description: "Annualized rate of new vehicle sales.", updateFrequency: "Monthly", source: "WardsAuto (Sample)", baseScore: 74 },
  { id: "durable-goods-orders", name: "Durable Goods Orders", categorySlug: "consumer-activity", currentValue: 1.2, previousValue: 0.8, unit: "% MoM", description: "Month-over-month change in orders for durable goods.", updateFrequency: "Monthly", source: "Census Bureau (Sample)", baseScore: 68 },

  // ── Prices & Stability (6) ──
  { id: "cpi-inflation", name: "CPI Inflation", categorySlug: "prices-stability", currentValue: 3.1, previousValue: 3.4, unit: "% YoY", description: "Consumer Price Index year-over-year change.", updateFrequency: "Monthly", source: "BLS (Sample)", baseScore: 58 },
  { id: "core-inflation", name: "Core Inflation", categorySlug: "prices-stability", currentValue: 2.8, previousValue: 3.1, unit: "% YoY", description: "CPI excluding food and energy.", updateFrequency: "Monthly", source: "BLS (Sample)", baseScore: 56 },
  { id: "pce-inflation", name: "PCE Price Index", categorySlug: "prices-stability", currentValue: 2.7, previousValue: 2.9, unit: "% YoY", description: "Personal Consumption Expenditures price index.", updateFrequency: "Monthly", source: "BEA (Sample)", baseScore: 60 },
  { id: "inflation-expectations", name: "Inflation Expectations", categorySlug: "prices-stability", currentValue: 3.0, previousValue: 3.2, unit: "% (1yr ahead)", description: "University of Michigan 1-year ahead inflation expectations.", updateFrequency: "Monthly", source: "U of Michigan (Sample)", baseScore: 54 },
  { id: "food-price-index", name: "Food Price Index", categorySlug: "prices-stability", currentValue: 2.4, previousValue: 2.6, unit: "% YoY", description: "Year-over-year change in food at home prices.", updateFrequency: "Monthly", source: "BLS (Sample)", baseScore: 64 },
  { id: "energy-price-index", name: "Energy Price Index", categorySlug: "prices-stability", currentValue: -1.2, previousValue: -0.8, unit: "% YoY", description: "Year-over-year change in energy prices.", updateFrequency: "Monthly", source: "BLS (Sample)", baseScore: 72 },

  // ── Policy & Financial (6) ──
  { id: "fed-funds-rate", name: "Federal Funds Rate", categorySlug: "policy-financial", currentValue: 5.25, previousValue: 5.50, unit: "%", description: "Target federal funds rate set by the Federal Reserve.", updateFrequency: "As needed", source: "Federal Reserve (Sample)", baseScore: 52 },
  { id: "treasury-yield-10y", name: "10-Year Treasury Yield", categorySlug: "policy-financial", currentValue: 4.28, previousValue: 4.35, unit: "%", description: "Yield on 10-year U.S. Treasury securities.", updateFrequency: "Daily", source: "Treasury (Sample)", baseScore: 64 },
  { id: "yield-curve", name: "Yield Curve Spread", categorySlug: "policy-financial", currentValue: -0.15, previousValue: -0.32, unit: "% (2s10s)", description: "Spread between 2-year and 10-year Treasury yields.", updateFrequency: "Daily", source: "Treasury (Sample)", baseScore: 48 },
  { id: "credit-conditions", name: "Credit Conditions", categorySlug: "policy-financial", currentValue: 54, previousValue: 50, unit: "Index", description: "Senior Loan Officer Opinion Survey - net percent tightening.", updateFrequency: "Quarterly", source: "Fed (Sample)", baseScore: 58 },
  { id: "m2-money-supply", name: "M2 Money Supply Growth", categorySlug: "policy-financial", currentValue: 1.8, previousValue: 1.2, unit: "% YoY", description: "Year-over-year growth of M2 money supply.", updateFrequency: "Monthly", source: "Federal Reserve (Sample)", baseScore: 62 },
  { id: "financial-stress-index", name: "Financial Stress Index", categorySlug: "policy-financial", currentValue: -0.42, previousValue: -0.35, unit: "Index", description: "Kansas City Fed Financial Stress Index.", updateFrequency: "Weekly", source: "KC Fed (Sample)", baseScore: 74 },

  // ── Production & Business (7) ──
  { id: "ism-pmi", name: "ISM Manufacturing PMI", categorySlug: "production-business", currentValue: 51.2, previousValue: 49.8, unit: "Index", description: "Institute for Supply Management Manufacturing Purchasing Managers' Index.", updateFrequency: "Monthly", source: "ISM (Sample)", baseScore: 66 },
  { id: "ism-services-pmi", name: "ISM Services PMI", categorySlug: "production-business", currentValue: 53.4, previousValue: 52.8, unit: "Index", description: "ISM Services Purchasing Managers' Index.", updateFrequency: "Monthly", source: "ISM (Sample)", baseScore: 74 },
  { id: "industrial-production", name: "Industrial Production", categorySlug: "production-business", currentValue: 0.8, previousValue: 0.4, unit: "% MoM", description: "Month-over-month change in total industrial production.", updateFrequency: "Monthly", source: "Federal Reserve (Sample)", baseScore: 68 },
  { id: "capacity-utilization", name: "Capacity Utilization", categorySlug: "production-business", currentValue: 78.6, previousValue: 78.2, unit: "%", description: "Percentage of potential output being utilized.", updateFrequency: "Monthly", source: "Federal Reserve (Sample)", baseScore: 72 },
  { id: "business-investment", name: "Business Fixed Investment", categorySlug: "production-business", currentValue: 3.4, previousValue: 2.8, unit: "% QoQ", description: "Quarterly growth of nonresidential fixed investment.", updateFrequency: "Quarterly", source: "BEA (Sample)", baseScore: 70 },
  { id: "small-business-confidence", name: "Small Business Confidence", categorySlug: "production-business", currentValue: 91.2, previousValue: 89.5, unit: "Index", description: "NFIB Small Business Optimism Index.", updateFrequency: "Monthly", source: "NFIB (Sample)", baseScore: 58 },
  { id: "factory-orders", name: "Factory Orders", categorySlug: "production-business", currentValue: 1.4, previousValue: 0.9, unit: "% MoM", description: "Month-over-month change in new orders for manufactured goods.", updateFrequency: "Monthly", source: "Census Bureau (Sample)", baseScore: 66 },

  // ── Housing & Wealth (6) ──
  { id: "housing-starts", name: "Housing Starts", categorySlug: "housing-wealth", currentValue: 1420, previousValue: 1380, unit: "K SAAR", description: "Annualized rate of new housing unit starts.", updateFrequency: "Monthly", source: "Census Bureau (Sample)", baseScore: 56 },
  { id: "home-prices", name: "Home Price Index", categorySlug: "housing-wealth", currentValue: 5.2, previousValue: 4.8, unit: "% YoY", description: "S&P CoreLogic Case-Shiller Home Price Index.", updateFrequency: "Monthly", source: "S&P (Sample)", baseScore: 62 },
  { id: "mortgage-rates", name: "30-Year Mortgage Rate", categorySlug: "housing-wealth", currentValue: 6.85, previousValue: 7.10, unit: "%", description: "Average 30-year fixed mortgage rate.", updateFrequency: "Weekly", source: "Freddie Mac (Sample)", baseScore: 42 },
  { id: "housing-affordability", name: "Housing Affordability", categorySlug: "housing-wealth", currentValue: 98.5, previousValue: 95.2, unit: "Index", description: "NAR Housing Affordability Index.", updateFrequency: "Monthly", source: "NAR (Sample)", baseScore: 48 },
  { id: "household-net-worth", name: "Household Net Worth", categorySlug: "housing-wealth", currentValue: 156.8, previousValue: 152.3, unit: "T USD", description: "Total household net worth.", updateFrequency: "Quarterly", source: "Fed Z.1 (Sample)", baseScore: 78 },
  { id: "existing-home-sales", name: "Existing Home Sales", categorySlug: "housing-wealth", currentValue: 4.15, previousValue: 3.98, unit: "M SAAR", description: "Annualized rate of existing home sales.", updateFrequency: "Monthly", source: "NAR (Sample)", baseScore: 52 },

  // ── Growth & Global Flows (6) ──
  { id: "gdp-growth", name: "GDP Growth", categorySlug: "growth-global-flows", currentValue: 2.8, previousValue: 2.4, unit: "% QoQ SAAR", description: "Quarter-over-quarter annualized real GDP growth.", updateFrequency: "Quarterly", source: "BEA (Sample)", baseScore: 80 },
  { id: "trade-balance", name: "Trade Balance", categorySlug: "growth-global-flows", currentValue: -65.2, previousValue: -68.5, unit: "B USD", description: "Monthly trade deficit in goods and services.", updateFrequency: "Monthly", source: "Census/BEA (Sample)", baseScore: 52 },
  { id: "usd-index", name: "U.S. Dollar Index", categorySlug: "growth-global-flows", currentValue: 103.8, previousValue: 104.2, unit: "Index", description: "Trade Weighted U.S. Dollar Index.", updateFrequency: "Daily", source: "Fed (Sample)", baseScore: 68 },
  { id: "foreign-direct-investment", name: "Foreign Direct Investment", categorySlug: "growth-global-flows", currentValue: 68.5, previousValue: 62.3, unit: "B USD (Q)", description: "Quarterly inward foreign direct investment.", updateFrequency: "Quarterly", source: "BEA (Sample)", baseScore: 72 },
  { id: "export-growth", name: "Export Growth", categorySlug: "growth-global-flows", currentValue: 3.8, previousValue: 3.1, unit: "% YoY", description: "Year-over-year growth in exports of goods and services.", updateFrequency: "Monthly", source: "Census/BEA (Sample)", baseScore: 70 },
  { id: "global-trade-volume", name: "Global Trade Volume", categorySlug: "growth-global-flows", currentValue: 2.1, previousValue: 1.8, unit: "% YoY", description: "Year-over-year growth in world merchandise trade volume.", updateFrequency: "Quarterly", source: "WTO (Sample)", baseScore: 66 },

  // ── Sentiment & Valuation (6) ──
  { id: "vix-index", name: "VIX Volatility Index", categorySlug: "sentiment-valuation", currentValue: 14.2, previousValue: 16.5, unit: "Index", description: "CBOE Volatility Index measuring market uncertainty.", updateFrequency: "Real-time", source: "CBOE (Sample)", baseScore: 80 },
  { id: "s-and-p-pe", name: "S&P 500 P/E Ratio", categorySlug: "sentiment-valuation", currentValue: 22.4, previousValue: 21.8, unit: "x", description: "Forward 12-month price-to-earnings ratio.", updateFrequency: "Daily", source: "FactSet (Sample)", baseScore: 62 },
  { id: "consumer-sentiment", name: "Consumer Sentiment", categorySlug: "sentiment-valuation", currentValue: 72.6, previousValue: 69.5, unit: "Index", description: "University of Michigan Consumer Sentiment Index.", updateFrequency: "Monthly", source: "U of Michigan (Sample)", baseScore: 68 },
  { id: "ceo-confidence", name: "CEO Confidence", categorySlug: "sentiment-valuation", currentValue: 65, previousValue: 60, unit: "% Optimistic", description: "Percentage of CEOs with positive 12-month outlook.", updateFrequency: "Quarterly", source: "Conference Board (Sample)", baseScore: 72 },
  { id: "jolts-quits-rate", name: "JOLTS Quits Rate", categorySlug: "sentiment-valuation", currentValue: 2.3, previousValue: 2.1, unit: "%", description: "Quits as a percentage of total employment.", updateFrequency: "Monthly", source: "BLS (Sample)", baseScore: 74 },
  { id: "yield-spread", name: "Bond-Equity Yield Gap", categorySlug: "sentiment-valuation", currentValue: 1.8, previousValue: 1.5, unit: "%", description: "Difference between earnings yield and 10-year Treasury yield.", updateFrequency: "Daily", source: "Calculated (Sample)", baseScore: 58 },
];

// Country-specific score offsets to differentiate economies
const countryOffsets: Record<string, Record<string, number>> = {
  us: {}, // base
  in: { "unemployment-rate": -8, "wage-growth": 6, "gdp-growth": 12, "cpi-inflation": -10, "fed-funds-rate": 5, "home-prices": -4, "consumer-spending": 4, "s-and-p-pe": -6, "ism-pmi": 4, "trade-balance": 8 },
  cn: { "unemployment-rate": -4, "gdp-growth": 8, "cpi-inflation": 12, "pce-inflation": 8, "fed-funds-rate": 10, "home-prices": -8, "consumer-spending": -2, "ism-pmi": -2, "s-and-p-pe": -10, "usd-index": -6, "consumer-confidence": -8 },
  de: { "unemployment-rate": 2, "gdp-growth": -6, "cpi-inflation": 4, "ism-pmi": -8, "fed-funds-rate": 2, "trade-balance": 10, "consumer-spending": -4, "vix-index": -2, "s-and-p-pe": 4, "housing-affordability": 6 },
  gb: { "unemployment-rate": 0, "gdp-growth": -4, "cpi-inflation": -4, "ism-pmi": -4, "fed-funds-rate": 0, "consumer-spending": -2, "s-and-p-pe": 2, "housing-affordability": -6, "home-prices": -4, "vix-index": -2 },
  jp: { "unemployment-rate": 6, "gdp-growth": -8, "cpi-inflation": 10, "ism-pmi": -6, "fed-funds-rate": 12, "trade-balance": -8, "consumer-spending": -6, "s-and-p-pe": 4, "vix-index": -2, "wage-growth": -10 },
  fr: { "unemployment-rate": -6, "gdp-growth": -4, "cpi-inflation": 2, "ism-pmi": -6, "fed-funds-rate": 2, "consumer-spending": -2, "s-and-p-pe": 2, "trade-balance": 4, "vix-index": -2, "home-prices": 2 },
  ca: { "unemployment-rate": 2, "gdp-growth": -2, "cpi-inflation": -2, "ism-pmi": -2, "fed-funds-rate": 0, "home-prices": -6, "mortgage-rates": -2, "housing-affordability": -4, "consumer-spending": -2, "trade-balance": 4 },
  au: { "unemployment-rate": 2, "gdp-growth": -2, "cpi-inflation": -4, "ism-pmi": -4, "fed-funds-rate": 0, "trade-balance": 6, "consumer-spending": 0, "home-prices": -4, "s-and-p-pe": 2, "vix-index": 0 },
  br: { "unemployment-rate": -10, "wage-growth": -4, "gdp-growth": 0, "cpi-inflation": -14, "fed-funds-rate": -8, "ism-pmi": 0, "trade-balance": 4, "consumer-confidence": -10, "s-and-p-pe": 0, "home-prices": -6, "financial-stress-index": -8 },
};

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function getChange(base: number): number {
  // Generate a plausible change value
  const raw = (base * 0.05) * (Math.sin(base) + 0.5);
  return Math.round(raw * 10) / 10;
}

export function getIndicatorsForCountry(countryId: string): Indicator[] {
  const offsets = countryOffsets[countryId] || {};
  return indicatorDefinitions.map((def) => {
    const offset = offsets[def.id] || 0;
    const change = getChange(def.baseScore + offset);
    return {
      id: def.id,
      name: def.name,
      categorySlug: def.categorySlug,
      score: clampScore(def.baseScore + offset),
      currentValue: def.currentValue,
      previousValue: def.previousValue,
      change: change,
      trend: change > 0.5 ? "up" : change < -0.5 ? "down" : "flat",
      unit: def.unit,
      description: def.description,
      updateFrequency: def.updateFrequency,
      source: def.source,
    };
  });
}

export function getAllIndicators(): IndicatorDefinition[] {
  return indicatorDefinitions;
}
