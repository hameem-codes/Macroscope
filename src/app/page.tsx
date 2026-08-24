"use client";

import { useState } from "react";
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
import { getCountryById } from "@/data/countries";
import { getCountryHealthData } from "@/lib/calculations";
import { getIndicatorsForCountry } from "@/data/indicators";

export default function OverviewPage() {
  const [countryId, setCountryId] = useState("us");
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    scoreRange: "all",
    trend: "all",
    sortBy: "score-desc",
  });

  const healthData = getCountryHealthData(countryId);
  const allIndicators = getIndicatorsForCountry(countryId);
  const country = getCountryById(countryId);

  const filteredIndicators = filterIndicators(allIndicators, filters);

  const strongest = [...allIndicators].sort((a, b) => b.score - a.score).slice(0, 5);
  const weakest = [...allIndicators].sort((a, b) => a.score - b.score).slice(0, 5);

  return (
    <Shell selectedCountry={countryId} onCountryChange={setCountryId}>
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
            {country?.flag} {country?.name || "Select a Country"}
          </h1>
          <p className="text-sm text-muted-foreground font-body">
            Simulated data · {allIndicators.length} indicators across {categories.length} categories
          </p>
        </div>

        {/* Barometer */}
        <div className="flex justify-center mb-8">
          <HealthBarometer
            score={healthData.overallScore}
            previousScore={healthData.previousScore}
            countryName={country?.name || ""}
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
          <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-wider font-heading">
            Sample data · Not live economic statistics
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
            {healthData.categoryScores.map((cs) => {
              const cat = categories.find((c) => c.slug === cs.categorySlug);
              return (
                <ScoreBar
                  key={cs.categorySlug}
                  score={cs.score}
                  label={cat?.name || cs.categorySlug}
                  change={cs.change}
                  color={cat?.color}
                  height={10}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Category Cards Grid */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <h2 className="font-heading font-bold text-lg text-foreground uppercase tracking-wider">
            Categories
          </h2>
          <div className="flex-1 h-0.5 bg-border" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <CategoryCard key={cat.slug} category={cat} countryId={countryId} index={i} />
          ))}
        </div>
      </section>

      {/* Trend Chart */}
      <section className="mb-10">
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
                {healthData.overallScore}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-heading font-bold">
                Previous Period
              </p>
              <p className="font-heading text-2xl font-extrabold text-muted-foreground tabular-nums">
                {healthData.previousScore}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-heading font-bold">
                Change
              </p>
              <p className="font-heading text-2xl font-extrabold text-green-600 tabular-nums">
                +{healthData.overallChange.toFixed(1)}
              </p>
            </div>
          </div>

          <TrendChart data={healthData.historicalScores} color="#8B5CF6" />
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

      {/* All 51 Indicators */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <h2 className="font-heading font-bold text-lg text-foreground uppercase tracking-wider">
            {allIndicators.length} Indicators
          </h2>
          <div className="flex-1 h-0.5 bg-border" />
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {[
            { label: "Strongest", value: strongest[0]?.name || "-", score: strongest[0]?.score || 0 },
            { label: "Weakest", value: weakest[0]?.name || "-", score: weakest[0]?.score || 0 },
            { label: "Most Improved", value: [...allIndicators].sort((a, b) => b.change - a.change)[0]?.name || "-", score: [...allIndicators].sort((a, b) => b.change - a.change)[0]?.score || 0 },
            { label: "Most Deteriorated", value: [...allIndicators].sort((a, b) => a.change - b.change)[0]?.name || "-", score: [...allIndicators].sort((a, b) => a.change - b.change)[0]?.score || 0 },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border-2 border-border rounded-lg p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-heading font-bold mb-1">
                {stat.label}
              </p>
              <p className="text-sm font-medium text-foreground truncate">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-5">
          <FilterControls onFilterChange={setFilters} />
        </div>

        {/* Indicator table / cards */}
        {filteredIndicators.length === 0 ? (
          <div className="bg-white border-2 border-border rounded-xl p-12 text-center">
            <p className="text-muted-foreground font-body">
              No indicators match your filters.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Try broadening your search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredIndicators.map((ind) => (
              <IndicatorCard key={ind.id} indicator={ind} />
            ))}
          </div>
        )}
      </section>

      {/* Data Status Footer */}
      <section className="mt-12 pt-6 border-t-2 border-border">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground font-body">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber animate-pulse" />
              <span className="font-heading font-bold uppercase tracking-wider">Sample Dataset</span>
            </div>
            <span>Last updated: Aug 24, 2026</span>
          </div>
          <div className="flex items-center gap-4">
            <span>{allIndicators.length} indicators</span>
            <span>{categories.length} categories</span>
          </div>
        </div>
      </section>
    </Shell>
  );
}
