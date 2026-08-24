"use client";

import { useState, useEffect } from "react";
import { useCountry } from "@/context/CountryContext";
import Shell from "@/components/layout/Shell";
import GeometricDecoration from "@/components/geometric/GeometricDecoration";
import { categories } from "@/data/categories";
import { countries } from "@/data/countries";
import { getScoreColor, getScoreRange } from "@/lib/types";

export default function GlobalRankingPage() {
  const { countryId } = useCountry();
  const [sortBy, setSortBy] = useState<"score-desc" | "score-asc">("score-desc");
  const [loading, setLoading] = useState(true);
  const [countriesData, setCountriesData] = useState<any[]>([]);

  useEffect(() => {
    let active = true;
    const controllers: AbortController[] = [];

    async function loadAll() {
      setLoading(true);
      try {
        const dataList = await Promise.all(
          countries.map(async (country) => {
            const controller = new AbortController();
            controllers.push(controller);
            const res = await fetch(`/api/countries/${country.id}/overview`, {
              signal: controller.signal
            });
            const data = await res.json();
            return {
              country,
              data,
              indicators: data.indicators || [],
            };
          })
        );
        if (active) {
          setCountriesData(dataList);
        }
      } catch (err) {
        if ((err as any).name !== "AbortError") {
          console.error("Failed to fetch global ranking data", err);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadAll();

    return () => {
      active = false;
      controllers.forEach(c => c.abort());
    };
  }, []);

  // Sort
  const allCountryData = [...countriesData].sort((a, b) =>
    sortBy === "score-desc"
      ? b.data.economyHealthScore - a.data.economyHealthScore
      : a.data.economyHealthScore - b.data.economyHealthScore
  );

  return (
    <Shell>
      {/* Header */}
      <section className="relative mb-8">
        <div className="absolute -top-8 right-10 pointer-events-none hidden lg:block">
          <GeometricDecoration variant="circle" color="#34D399" size={120} />
        </div>
        <div className="absolute top-16 -left-4 pointer-events-none hidden lg:block">
          <GeometricDecoration variant="triangle" color="#FBBF24" size={36} />
        </div>

        <h1 className="font-heading text-3xl lg:text-4xl font-extrabold text-foreground uppercase tracking-wide mb-2">
          Global Economic Health
        </h1>
        <p className="text-sm text-muted-foreground font-body">
          Comparative ranking of {countries.length} economies based on live World Bank economic indicators.
        </p>

        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={() => setSortBy("score-desc")}
            className={`px-3 py-1.5 text-xs font-heading font-bold uppercase tracking-wider rounded-lg border-2 transition-colors ${
              sortBy === "score-desc"
                ? "border-foreground bg-foreground text-white"
                : "border-border text-foreground hover:border-foreground"
            }`}
          >
            Highest First
          </button>
          <button
            onClick={() => setSortBy("score-asc")}
            className={`px-3 py-1.5 text-xs font-heading font-bold uppercase tracking-wider rounded-lg border-2 transition-colors ${
              sortBy === "score-asc"
                ? "border-foreground bg-foreground text-white"
                : "border-border text-foreground hover:border-foreground"
            }`}
          >
            Lowest First
          </button>
        </div>
      </section>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-foreground mb-4"></div>
          <p className="font-heading font-bold text-xl text-foreground">
            Loading global ranking data...
          </p>
        </div>
      ) : (
        <>
          {/* Ranking table */}
          <section className="mb-10">
            <div className="bg-white border-2 border-foreground rounded-xl shadow-card overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-[48px_1fr_80px_100px_1fr] sm:grid-cols-[48px_1fr_80px_100px_1fr] gap-4 items-center px-6 py-3 border-b-2 border-foreground bg-muted">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-heading font-bold">#</span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-heading font-bold">Country</span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-heading font-bold text-right">Score</span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-heading font-bold text-center">Status</span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-heading font-bold hidden sm:block">Health</span>
              </div>

              {/* Rows */}
              {allCountryData.map((item, rank) => {
                const scoreColor = getScoreColor(item.data.economyHealthScore);
                return (
                  <div
                    key={item.country.id}
                    className={`grid grid-cols-[48px_1fr_80px_100px_1fr] sm:grid-cols-[48px_1fr_80px_100px_1fr] gap-4 items-center px-6 py-4 border-b border-border last:border-0 hover:bg-muted/50 transition-colors ${
                      rank === 0 ? "bg-tertiary/5" : ""
                    }`}
                  >
                    {/* Rank */}
                    <span className={`font-heading text-lg tabular-nums ${
                      rank === 0 ? "font-extrabold text-tertiary" : rank < 3 ? "font-bold text-foreground" : "font-medium text-muted-foreground"
                    }`}>
                      {rank + 1}
                    </span>

                    {/* Country */}
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-2xl flex-shrink-0">{item.country.flag}</span>
                      <div className="min-w-0">
                        <p className="font-heading font-bold text-sm text-foreground truncate">
                          {item.country.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground">{item.indicators.length} indicators</p>
                      </div>
                    </div>

                    {/* Score */}
                    <span
                      className="font-heading text-xl font-extrabold tabular-nums text-right"
                      style={{ color: scoreColor }}
                    >
                      {item.data.economyHealthScore}
                    </span>

                    {/* Status badge */}
                    <div className="text-center">
                      <span
                        className="text-[10px] font-heading font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border inline-block"
                        style={{ borderColor: scoreColor, color: scoreColor, backgroundColor: `${scoreColor}10` }}
                      >
                        {item.data.status}
                      </span>
                    </div>

                    {/* Health bar */}
                    <div className="hidden sm:block">
                      <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700 ease-out"
                          style={{
                            width: `${item.data.economyHealthScore}%`,
                            backgroundColor: scoreColor,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Category breakdown for top 5 */}
          <section className="mb-10">
            <h2 className="font-heading font-bold text-sm uppercase tracking-wider text-foreground mb-4">
              Category Breakdown — Top 5 Economies
            </h2>
            <div className="bg-white border-2 border-foreground rounded-xl p-6 shadow-card overflow-x-auto">
              <table className="w-full min-w-[500px]" role="table">
                <thead>
                  <tr className="border-b-2 border-border">
                    <th className="text-left py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-heading font-bold">
                      Category
                    </th>
                    {allCountryData.slice(0, 5).map((item) => (
                      <th
                        key={item.country.id}
                        className="text-center py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-heading font-bold"
                      >
                        {item.country.flag}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat.slug} className="border-b border-border last:border-0">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: cat.color }} />
                          <span className="text-sm font-medium font-body text-foreground">{cat.name}</span>
                        </div>
                      </td>
                      {allCountryData.slice(0, 5).map((item) => {
                        const catScore = item.data.categoryScores.find((c: any) => c.categorySlug === cat.slug);
                        const score = catScore?.score || 0;
                        // Highlight the best in this row
                        const allScores = allCountryData.slice(0, 5).map((d) => {
                          const cs = d.data.categoryScores.find((c: any) => c.categorySlug === cat.slug);
                          return cs?.score || 0;
                        });
                        const isBest = score === Math.max(...allScores);
                        return (
                          <td key={item.country.id} className="text-center py-3">
                            <span
                              className={`font-heading text-sm tabular-nums ${isBest ? "font-extrabold" : "font-medium"}`}
                              style={{ color: isBest ? getScoreColor(score) : "#64748B" }}
                            >
                              {score}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  <tr className="border-t-2 border-foreground font-bold">
                    <td className="py-3">
                      <span className="text-sm font-heading font-extrabold text-foreground">Overall</span>
                    </td>
                    {allCountryData.slice(0, 5).map((item) => (
                      <td key={item.country.id} className="text-center py-3">
                        <span
                          className="font-heading text-sm font-extrabold tabular-nums"
                          style={{ color: getScoreColor(item.data.economyHealthScore) }}
                        >
                          {item.data.economyHealthScore}
                        </span>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {/* Data note */}
      <section className="mt-8 pt-6 border-t-2 border-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-body">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="font-heading font-bold uppercase tracking-wider text-green-700">Live World Bank Data</span>
          <span>· Real-time calculated health ranking.</span>
        </div>
      </section>
    </Shell>
  );
}
