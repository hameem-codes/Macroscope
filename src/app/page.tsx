"use client";

import { useState, useEffect } from "react";
import { useCountry } from "@/context/CountryContext";
import Shell from "@/components/layout/Shell";
import HealthBarometer from "@/components/barometer/HealthBarometer";
import ScoreBar from "@/components/cards/ScoreBar";
import CategoryCard from "@/components/cards/CategoryCard";
import IndicatorCard from "@/components/cards/IndicatorCard";
import TrendChart from "@/components/charts/TrendChart";
import TopMovers from "@/components/cards/TopMovers";
import FilterControls, { filterIndicators, FilterState } from "@/components/filters/FilterControls";
import GeometricDecoration from "@/components/geometric/GeometricDecoration";
import { categories } from "@/data/categories";
import IndicatorDetailModal from "@/components/modals/IndicatorDetailModal";
import AiSummary from "@/components/dashboard/AiSummary";
import { Indicator } from "@/lib/types";

export default function OverviewPage() {
  const { countryId } = useCountry();
  const [selectedIndicator, setSelectedIndicator] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    scoreRange: "all",
    trend: "all",
    sortBy: "score-desc",
  });

  const [loading, setLoading] = useState(true);
  const [healthData, setHealthData] = useState<any>(null);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/countries/${countryId}/overview`, {
          signal: controller.signal
        });
        const data = await res.json();
        if (active) {
          setHealthData(data);
        }
      } catch (err) {
        if ((err as any).name !== "AbortError") {
          console.error("Failed to fetch country data", err);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    
    if (countryId) {
      fetchData();
    }

    return () => {
      active = false;
      controller.abort();
    };
  }, [countryId]);

  if (loading || !healthData) {
    return (
      <Shell>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-foreground mb-4"></div>
          <p className="font-heading font-bold text-xl text-foreground">
            Analyzing {countryId.toUpperCase()}&apos;s economic indicators...
          </p>
          <p className="text-sm text-muted-foreground mt-2">Fetching live data from World Bank...</p>
        </div>
      </Shell>
    );
  }

  const allIndicators: Indicator[] = healthData.indicators || [];
  const filteredIndicators = filterIndicators(allIndicators, filters);

  const strongest = [...allIndicators].sort((a, b) => b.score - a.score).slice(0, 5);
  const weakest = [...allIndicators].sort((a, b) => a.score - b.score).slice(0, 5);

  const selectedInd = selectedIndicator
    ? allIndicators.find((i) => i.id === selectedIndicator)
    : null;
  const selectedIndCategory = selectedInd 
    ? categories.find((c) => c.slug === selectedInd.categorySlug) 
    : undefined;

  return (
    <Shell>
      {/* Hero Section */}
      <section className="relative mb-10">
        {/* Geometric decorations */}
        <div className="absolute -top-10 right-10 pointer-events-none hidden lg:block">
          <GeometricDecoration variant="dots" color="#8B5CF6" size={120} />
        </div>
        <div className="absolute top-20 -left-6 pointer-events-none hidden lg:block">
          <GeometricDecoration variant="triangle" color="#FBBF24" size={40} />
        </div>

        {/* Country + Score header */}
        <div className="text-center mb-8">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-heading font-bold mb-2">
            Country Economy Overview
          </p>
          <h1 className="font-heading text-4xl lg:text-5xl font-extrabold text-foreground mb-1">
            {healthData.countryCode}
          </h1>
          <p className="text-sm text-muted-foreground font-body">
            Live API Data · {allIndicators.length} indicators across {categories.length} categories
          </p>
        </div>

        {/* Barometer */}
        <div className="flex justify-center mb-8">
          <HealthBarometer
            score={healthData.economyHealthScore}
            previousScore={Math.max(0, healthData.economyHealthScore - 2)}
            countryName={healthData.countryCode}
          />
        </div>

        {/* Score interpretation */}
        <div className="max-w-xl mx-auto text-center mb-6">
          <h2 className="font-heading font-bold text-lg text-foreground mb-1">
            Economy Health Score
          </h2>
          <p className="text-sm text-muted-foreground font-body leading-relaxed italic">
            &ldquo;{healthData.interpretation}&rdquo;
          </p>
        </div>
      </section>

      {/* Category Score Breakdown */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <h2 className="font-heading font-bold text-lg text-foreground uppercase tracking-wider">
            Economy Health Breakdown
          </h2>
          <div className="flex-1 h-0.5 bg-border" />
        </div>

        <div className="bg-white border-2 border-foreground rounded-xl p-6 shadow-card">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
            {healthData.categoryScores.map((cs: any) => {
              const cat = categories.find((c) => c.slug === cs.categorySlug);
              if (!cat) return null;
              return (
                <ScoreBar
                  key={cs.categorySlug}
                  score={cs.score}
                  label={cat.name}
                  change={cs.change}
                  color={cat.color}
                  height={10}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Trend Chart & AI Summary */}
      <section className="mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Trend Chart */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-5">
              <h2 className="font-heading font-bold text-lg text-foreground uppercase tracking-wider">
                Economy Trend
              </h2>
              <div className="flex-1 h-0.5 bg-border" />
            </div>

            <div className="bg-white border-2 border-foreground rounded-xl p-6 shadow-card relative overflow-hidden">
              <div className="absolute -top-4 -right-4 pointer-events-none">
                <GeometricDecoration variant="circle" color="#34D399" size={80} />
              </div>

              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-heading font-bold">
                    Current
                  </p>
                  <p className="font-heading text-2xl font-extrabold text-foreground tabular-nums">
                    {healthData.economyHealthScore}
                  </p>
                </div>
              </div>

              <TrendChart data={healthData.historicalScores || []} color="#8B5CF6" />
            </div>
          </div>

          {/* AI Summary */}
          <div className="flex flex-col">
            <AiSummary countryId={healthData.countryCode} />
          </div>
        </div>
      </section>

      {/* Top Movers */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <h2 className="font-heading font-bold text-lg text-foreground uppercase tracking-wider">
            Top Movers
          </h2>
          <div className="flex-1 h-0.5 bg-border" />
        </div>
        <TopMovers indicators={allIndicators} />
      </section>

      {/* All Indicators */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <h2 className="font-heading font-bold text-lg text-foreground uppercase tracking-wider">
            {allIndicators.length} Indicators
          </h2>
          <div className="flex-1 h-0.5 bg-border" />
        </div>

        {/* Filters */}
        <div className="mb-5">
          <FilterControls onFilterChange={setFilters} />
        </div>

        {/* Indicator cards */}
        {filteredIndicators.length === 0 ? (
          <div className="bg-white border-2 border-border rounded-xl p-12 text-center">
            <p className="text-muted-foreground font-body">
              No indicators match your filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredIndicators.map((ind) => (
              <IndicatorCard key={ind.id} indicator={ind} onClick={() => setSelectedIndicator(ind.id)} />
            ))}
          </div>
        )}
      </section>

      {/* Data Status Footer */}
      <section className="mt-12 pt-6 border-t-2 border-border">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground font-body">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="font-heading font-bold uppercase tracking-wider text-green-700">Live API Data (World Bank)</span>
            </div>
            <span>On-demand fetching</span>
          </div>
          <div className="flex items-center gap-4">
            <span>{allIndicators.length} active indicators</span>
          </div>
        </div>
      </section>

      {/* Indicator Detail Modal */}
      {selectedInd && selectedIndCategory && (
        <IndicatorDetailModal
          indicator={selectedInd}
          category={selectedIndCategory}
          onClose={() => setSelectedIndicator(null)}
        />
      )}
    </Shell>
  );
}
