import { CategoryConfig } from "@/lib/types";

export const categories: CategoryConfig[] = [
  {
    id: "labor",
    name: "Labor & Income",
    slug: "labor-income",
    color: "#8B5CF6",
    shadowColor: "shadow-violet",
    icon: "👷",
    description: "Employment conditions, wages, and labor market health.",
  },
  {
    id: "consumer",
    name: "Consumer Activity",
    slug: "consumer-activity",
    color: "#F472B6",
    shadowColor: "shadow-pink",
    icon: "🛒",
    description: "Consumer spending patterns and retail activity.",
  },
  {
    id: "prices",
    name: "Prices & Stability",
    slug: "prices-stability",
    color: "#FBBF24",
    shadowColor: "shadow-amber",
    icon: "📊",
    description: "Inflation, deflation, and price stability metrics.",
  },
  {
    id: "policy",
    name: "Policy & Financial",
    slug: "policy-financial",
    color: "#34D399",
    shadowColor: "shadow-mint",
    icon: "🏛️",
    description: "Central bank policy, interest rates, and financial conditions.",
  },
  {
    id: "production",
    name: "Production & Business",
    slug: "production-business",
    color: "#60A5FA",
    shadowColor: "shadow-blue",
    icon: "🏭",
    description: "Manufacturing output, business investment, and industrial activity.",
  },
  {
    id: "housing",
    name: "Housing & Wealth",
    slug: "housing-wealth",
    color: "#F472B6",
    shadowColor: "shadow-pink",
    icon: "🏠",
    description: "Housing market, real estate, and household wealth.",
  },
  {
    id: "growth",
    name: "Growth & Global Flows",
    slug: "growth-global-flows",
    color: "#FBBF24",
    shadowColor: "shadow-amber",
    icon: "🌍",
    description: "GDP growth, trade balance, and international capital flows.",
  },
  {
    id: "sentiment",
    name: "Sentiment & Valuation",
    slug: "sentiment-valuation",
    color: "#34D399",
    shadowColor: "shadow-mint",
    icon: "📈",
    description: "Market sentiment, consumer confidence, and asset valuations.",
  },
];

export function getCategoryBySlug(slug: string): CategoryConfig | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getCategoryById(id: string): CategoryConfig | undefined {
  return categories.find((c) => c.id === id);
}
