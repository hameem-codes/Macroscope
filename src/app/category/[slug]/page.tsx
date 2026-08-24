"use client";

import { useState, useEffect } from "react";
import { useCountry } from "@/context/CountryContext";
import { useParams } from "next/navigation";
import Link from "next/link";
import Shell from "@/components/layout/Shell";
import ScoreBadge from "@/components/cards/ScoreBadge";
import IndicatorCard from "@/components/cards/IndicatorCard";
import TrendChart from "@/components/charts/TrendChart";
import FilterControls, { filterIndicators, FilterState } from "@/components/filters/FilterControls";
import GeometricDecoration from "@/components/geometric/GeometricDecoration";
import { getCategoryBySlug } from "@/data/categories";
import { getCountryById } from "@/data/countries";
import IndicatorDetailModal from "@/components/modals/IndicatorDetailModal";
import { Indicator } from "@/lib/types";

export default function CategoryDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { countryId } = useCountry();
  const [filters, setFilters] = useState<FilterState>({
    category: slug,
    scoreRange: "all",
    trend: "all",
    sortBy: "score-desc",
  });
  const [selectedIndicator, setSelectedIndicator] = useState<string | null>(null);
  
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
          console.error("Failed to fetch country category data", err);
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

  const category = getCategoryBySlug(slug);

  if (!category) {
    return (
      <Shell>
        <div className="text-center py-20">
          <h1 className="font-heading text-2xl font-bold text-foreground mb-4">Category Not Found</h1>
          <p className="text-muted-foreground font-body">
            This category does not exist. Try one of the categories from the sidebar.
          </p>
        </div>
      </Shell>
    );
  }

  if (loading || !healthData) {
    return (
      <Shell>
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-foreground mb-4"></div>
          <p className="font-heading font-bold text-xl text-foreground">
            Loading category indicators...
          </p>
        </div>
      </Shell>
    );
  }

  const allIndicators: Indicator[] = healthData.indicators || [];
  const categoryIndicators = allIndicators.filter((i: Indicator) => i.categorySlug === slug);
  const catScore = healthData.categoryScores.find((c: any) => c.categorySlug === slug);
  const country = getCountryById(countryId);
  const historicalScores = healthData.historicalCategoryScores?.[slug] || [];

  const filteredIndicators = filterIndicators(
    categoryIndicators,
    { ...filters, category: slug }
  );

  const selectedInd = selectedIndicator
    ? categoryIndicators.find((i: any) => i.id === selectedIndicator)
    : null;

  return (
    <Shell>
      {/* Category Header */}
      <section className="relative mb-8">
        {/* Decorations */}
        <div className="absolute -top-8 right-12 pointer-events-none hidden lg:block">
          <GeometricDecoration variant="circle" color={category.color} size={100} />
        </div>
        <div className="absolute top-16 -left-4 pointer-events-none hidden lg:block">
          <GeometricDecoration variant="diamond" color={category.color} size={30} />
        </div>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground font-body mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-foreground transition-colors">Overview</Link>
          <span>/</span>
          <span className="text-foreground font-medium">{category.name}</span>
        </nav>

        <div className="flex flex-col lg:flex-row lg:items-end gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{category.icon}</span>
              <h1 className="font-heading text-3xl lg:text-4xl font-extrabold text-foreground uppercase tracking-wide">
                {category.name}
              </h1>
            </div>
            <p className="text-sm text-muted-foreground font-body mb-4">{category.description}</p>

            <div className="flex flex-wrap items-center gap-6">
              {catScore && (
                <ScoreBadge score={catScore.score} size="lg" />
              )}
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-heading font-bold">Change</p>
                <p className={`font-heading text-lg font-bold tabular-nums ${
                  (catScore?.change || 0) > 0 ? "text-green-600" : (catScore?.change || 0) < 0 ? "text-red-500" : "text-muted-foreground"
                }`}>
                  {(catScore?.change || 0) > 0 ? "+" : ""}{(catScore?.change || 0).toFixed(1)}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-heading font-bold">Indicators</p>
                <p className="font-heading text-lg font-bold text-foreground">{categoryIndicators.length}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Summary */}
      <section className="mb-8">
        <div className="bg-white border-2 border-foreground rounded-xl p-6 shadow-card relative overflow-hidden">
          <div className="absolute -bottom-4 -right-4 pointer-events-none">
            <GeometricDecoration variant="dots" color={category.color} size={80} />
          </div>
          <h2 className="font-heading font-bold text-sm uppercase tracking-wider text-foreground mb-2">Category Summary</h2>
          <p className="text-sm text-muted-foreground font-body leading-relaxed max-w-2xl italic">
            &ldquo;{catScore?.interpretation || "No data available for this category."}&rdquo;
          </p>
        </div>
      </section>

      {/* Historical Trend */}
      {historicalScores.length > 0 && (
        <section className="mb-8">
          <h2 className="font-heading font-bold text-sm uppercase tracking-wider text-foreground mb-4">
            Score History
          </h2>
          <div className="bg-white border-2 border-foreground rounded-xl p-6 shadow-card">
            <TrendChart data={historicalScores} color={category.color} label={`${category.name} Score Trend`} />
          </div>
        </section>
      )}

      {/* Indicators */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-5">
          <h2 className="font-heading font-bold text-sm uppercase tracking-wider text-foreground">
            {categoryIndicators.length} Indicators
          </h2>
          <div className="flex-1 h-0.5 bg-border" />
        </div>

        <div className="mb-5">
          <FilterControls
            onFilterChange={(f) => setFilters({ ...f, category: slug })}
          />
        </div>

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
              <IndicatorCard
                key={ind.id}
                indicator={ind}
                onClick={() => setSelectedIndicator(ind.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Indicator Detail Modal */}
      {selectedInd && (
        <IndicatorDetailModal
          indicator={selectedInd}
          category={category}
          onClose={() => setSelectedIndicator(null)}
        />
      )}
    </Shell>
  );
}
