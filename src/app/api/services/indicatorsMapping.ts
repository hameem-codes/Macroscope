export type Direction = "higher_is_better" | "lower_is_better" | "neutral";

export interface ProviderIndicator {
  id: string; // Internal dashboard ID
  name: string;
  categorySlug: string;
  source: "World Bank" | "IMF" | "OECD";
  sourceIndicatorId: string;
  direction: Direction;
  // min and max values to normalize the score from 0 to 100
  // If not provided, we can dynamically normalize based on historical data if needed,
  // but min/max is safer for a global baseline.
  min: number;
  max: number;
  unit: string;
  description: string;
}

export const wbIndicatorsMapping: ProviderIndicator[] = [
  // ── Labor & Income ──
  {
    id: "unemployment-rate",
    name: "Unemployment Rate",
    categorySlug: "labor-income",
    source: "World Bank",
    sourceIndicatorId: "SL.UEM.TOTL.ZS",
    direction: "lower_is_better",
    min: 2, max: 15,
    unit: "%",
    description: "Unemployment, total (% of total labor force) (modeled ILO estimate)",
  },
  {
    id: "labor-force-participation",
    name: "Labor Force Participation",
    categorySlug: "labor-income",
    source: "World Bank",
    sourceIndicatorId: "SL.TLF.CACT.ZS",
    direction: "higher_is_better",
    min: 40, max: 85,
    unit: "%",
    description: "Labor force participation rate, total (% of total population ages 15+) (modeled ILO estimate)",
  },
  {
    id: "employment-to-population",
    name: "Employment-to-Population Ratio",
    categorySlug: "labor-income",
    source: "World Bank",
    sourceIndicatorId: "SL.EMP.TOTL.SP.ZS",
    direction: "higher_is_better",
    min: 40, max: 80,
    unit: "%",
    description: "Employment to population ratio, 15+, total (%) (modeled ILO estimate)",
  },

  // ── Consumer Activity ──
  {
    id: "consumer-spending-growth",
    name: "Consumer Spending Growth",
    categorySlug: "consumer-activity",
    source: "World Bank",
    sourceIndicatorId: "NE.CON.PRVT.KD.ZG",
    direction: "higher_is_better",
    min: -5, max: 10,
    unit: "% YoY",
    description: "Households and NPISHs final consumption expenditure (annual % growth)",
  },
  {
    id: "consumer-spending-gdp",
    name: "Consumer Spending (% GDP)",
    categorySlug: "consumer-activity",
    source: "World Bank",
    sourceIndicatorId: "NE.CON.PRVT.ZS",
    direction: "neutral",
    min: 40, max: 80,
    unit: "% of GDP",
    description: "Households and NPISHs final consumption expenditure (% of GDP)",
  },

  // ── Prices & Stability ──
  {
    id: "cpi-inflation",
    name: "CPI Inflation",
    categorySlug: "prices-stability",
    source: "World Bank",
    sourceIndicatorId: "FP.CPI.TOTL.ZG",
    direction: "lower_is_better",
    min: 0, max: 20, // Negative can be bad (deflation), but simple min/max for now
    unit: "% YoY",
    description: "Inflation, consumer prices (annual %)",
  },
  {
    id: "gdp-deflator",
    name: "GDP Deflator Inflation",
    categorySlug: "prices-stability",
    source: "World Bank",
    sourceIndicatorId: "NY.GDP.DEFL.KD.ZG",
    direction: "lower_is_better",
    min: 0, max: 20,
    unit: "% YoY",
    description: "Inflation, GDP deflator (annual %)",
  },

  // ── Policy & Financial ──
  {
    id: "real-interest-rate",
    name: "Real Interest Rate",
    categorySlug: "policy-financial",
    source: "World Bank",
    sourceIndicatorId: "FR.INR.RINR",
    direction: "neutral",
    min: -10, max: 15,
    unit: "%",
    description: "Real interest rate (%)",
  },
  {
    id: "broad-money-growth",
    name: "Broad Money Growth",
    categorySlug: "policy-financial",
    source: "World Bank",
    sourceIndicatorId: "FM.LBL.BMNY.ZG",
    direction: "neutral",
    min: 0, max: 30,
    unit: "% YoY",
    description: "Broad money growth (annual %)",
  },
  {
    id: "lending-interest-rate",
    name: "Lending Interest Rate",
    categorySlug: "policy-financial",
    source: "World Bank",
    sourceIndicatorId: "FR.INR.LEND",
    direction: "lower_is_better",
    min: 0, max: 40,
    unit: "%",
    description: "Lending interest rate (%)",
  },

  // ── Production & Business ──
  {
    id: "industry-value-added-growth",
    name: "Industrial Production Growth",
    categorySlug: "production-business",
    source: "World Bank",
    sourceIndicatorId: "NV.IND.TOTL.KD.ZG",
    direction: "higher_is_better",
    min: -10, max: 15,
    unit: "% YoY",
    description: "Industry (including construction), value added (annual % growth)",
  },
  {
    id: "capital-formation-growth",
    name: "Gross Capital Formation Growth",
    categorySlug: "production-business",
    source: "World Bank",
    sourceIndicatorId: "NE.GDI.TOTL.KD.ZG",
    direction: "higher_is_better",
    min: -15, max: 20,
    unit: "% YoY",
    description: "Gross capital formation (annual % growth)",
  },

  // ── Housing & Wealth (Proxy via credit) ──
  {
    id: "domestic-credit-private",
    name: "Credit to Private Sector",
    categorySlug: "housing-wealth",
    source: "World Bank",
    sourceIndicatorId: "FS.AST.PRVT.GD.ZS",
    direction: "higher_is_better",
    min: 20, max: 200,
    unit: "% of GDP",
    description: "Domestic credit to private sector (% of GDP)",
  },

  // ── Growth & Global Flows ──
  {
    id: "gdp-growth",
    name: "GDP Growth",
    categorySlug: "growth-global-flows",
    source: "World Bank",
    sourceIndicatorId: "NY.GDP.MKTP.KD.ZG",
    direction: "higher_is_better",
    min: -5, max: 10,
    unit: "% YoY",
    description: "GDP growth (annual %)",
  },
  {
    id: "trade-gdp",
    name: "Trade Volume",
    categorySlug: "growth-global-flows",
    source: "World Bank",
    sourceIndicatorId: "NE.TRD.GNFS.ZS",
    direction: "higher_is_better",
    min: 20, max: 150,
    unit: "% of GDP",
    description: "Trade (% of GDP)",
  },
  {
    id: "fdi-inflows",
    name: "FDI Net Inflows",
    categorySlug: "growth-global-flows",
    source: "World Bank",
    sourceIndicatorId: "BX.KLT.DINV.WD.GD.ZS",
    direction: "higher_is_better",
    min: -5, max: 15,
    unit: "% of GDP",
    description: "Foreign direct investment, net inflows (% of GDP)",
  },
  {
    id: "export-growth",
    name: "Export Growth",
    categorySlug: "growth-global-flows",
    source: "World Bank",
    sourceIndicatorId: "NE.EXP.GNFS.KD.ZG",
    direction: "higher_is_better",
    min: -15, max: 20,
    unit: "% YoY",
    description: "Exports of goods and services (annual % growth)",
  },

  // ── Sentiment & Valuation (Proxy via market cap if available, otherwise limited) ──
  {
    id: "market-cap-gdp",
    name: "Market Capitalization",
    categorySlug: "sentiment-valuation",
    source: "World Bank",
    sourceIndicatorId: "CM.MKT.LCAP.GD.ZS",
    direction: "higher_is_better",
    min: 10, max: 200,
    unit: "% of GDP",
    description: "Market capitalization of listed domestic companies (% of GDP)",
  }
];

// Combine all sources if we add more
export const allProviderIndicators = [...wbIndicatorsMapping];
