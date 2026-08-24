"use client";

import { useState } from "react";
import Shell from "@/components/layout/Shell";
import TrendChart from "@/components/charts/TrendChart";
import GeometricDecoration from "@/components/geometric/GeometricDecoration";
import { categories } from "@/data/categories";
import { countries, getCountryById } from "@/data/countries";
import { getCountryHealthData } from "@/lib/calculations";
import { getIndicatorsForCountry } from "@/data/indicators";
import { getScoreColor, getScoreRange } from "@/lib/types";

export default function ComparePage() {
  const [countryId, setCountryId] = useState("us");
  const [selectedCountries, setSelectedCountries] = useState<string[]>(["us", "in", "de", "jp", "gb"]);

  const toggleCountry = (id: string) => {
    setSelectedCountries((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const healthDataMap = selectedCountries.map((id) => ({
    id,
    country: getCountryById(id)!,
    data: getCountryHealthData(id),
  }));

  // Sort by score descending
  healthDataMap.sort((a, b) => b.data.overallScore - a.data.overallScore);



  return (
    <Shell selectedCountry={countryId} onCountryChange={setCountryId}>
      {/* Header */}
      <section className="relative mb-8">
        <div className="absolute -top-6 right-8 pointer-events-none hidden lg:block">
          <GeometricDecoration variant="dots" color="#F472B6" size={100} />
        </div>
        <h1 className="font-heading text-3xl lg:text-4xl font-extrabold text-foreground uppercase tracking-wide mb-2">
          Compare Economies
        </h1>
        <p className="text-sm text-muted-foreground font-body">
          Select countries to compare their economic health scores and category breakdowns.
        </p>
      </section>

      {/* Country selector chips */}
      <section className="mb-8">
        <h2 className="font-heading font-bold text-sm uppercase tracking-wider text-foreground mb-3">
          Select Countries
        </h2>
        <div className="flex flex-wrap gap-2">
          {countries.map((country) => {
            const isSelected = selectedCountries.includes(country.id);
            return (
              <button
                key={country.id}
                onClick={() => toggleCountry(country.id)}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg border-2 text-sm font-body font-medium transition-all
                  ${isSelected
                    ? "border-foreground bg-foreground text-white"
                    : "border-border bg-white text-foreground hover:border-foreground"
                  }
                `}
                aria-pressed={isSelected}
              >
                <span>{country.flag}</span>
                <span>{country.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Comparison bars */}
      {healthDataMap.length === 0 ? (
        <div className="bg-white border-2 border-border rounded-xl p-12 text-center">
          <p className="text-muted-foreground font-body">
            Select at least one country to compare.
          </p>
        </div>
      ) : (
        <section className="mb-10">
          <h2 className="font-heading font-bold text-sm uppercase tracking-wider text-foreground mb-4">
            Overall Health Score Ranking
          </h2>
          <div className="bg-white border-2 border-foreground rounded-xl p-6 shadow-card">
            <div className="space-y-4">
              {healthDataMap.map((item, rank) => {
                const scoreColor = getScoreColor(item.data.overallScore);
                return (
                  <div key={item.id} className="flex items-center gap-4">
                    <span className="font-heading text-lg font-extrabold text-muted-foreground w-8 text-right tabular-nums">
                      {rank + 1}
                    </span>
                    <span className="text-2xl">{item.country.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-heading font-bold text-sm text-foreground truncate pr-4">
                          {item.country.name}
                        </span>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="font-heading text-xl font-extrabold tabular-nums" style={{ color: scoreColor }}>
                            {item.data.overallScore}
                          </span>
                          <span className="text-xs text-muted-foreground">/100</span>
                          <span className="text-[10px] font-heading font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border" style={{ borderColor: scoreColor, color: scoreColor }}>
                            {getScoreRange(item.data.overallScore)}
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700 ease-out"
                          style={{
                            width: `${(item.data.overallScore / 100) * 100}%`,
                            backgroundColor: scoreColor,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Category Comparison */}
      {healthDataMap.length >= 2 && (
        <section className="mb-10">
          <h2 className="font-heading font-bold text-sm uppercase tracking-wider text-foreground mb-4">
            Category Comparison
          </h2>
          <div className="bg-white border-2 border-foreground rounded-xl p-6 shadow-card overflow-x-auto">
            <table className="w-full min-w-[600px]" role="table">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="text-left py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-heading font-bold">
                    Category
                  </th>
                  {healthDataMap.map((item) => (
                    <th
                      key={item.id}
                      className="text-center py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-heading font-bold"
                    >
                      {item.country.flag} {item.country.code}
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
                    {healthDataMap.map((item) => {
                      const catScore = item.data.categoryScores.find((c) => c.categorySlug === cat.slug);
                      const score = catScore?.score || 0;
                      return (
                        <td key={item.id} className="text-center py-3">
                          <span
                            className="font-heading text-sm font-bold tabular-nums"
                            style={{ color: getScoreColor(score) }}
                          >
                            {score}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
                {/* Overall row */}
                <tr className="border-t-2 border-foreground font-bold">
                  <td className="py-3">
                    <span className="text-sm font-heading font-extrabold text-foreground">Overall</span>
                  </td>
                  {healthDataMap.map((item) => (
                    <td key={item.id} className="text-center py-3">
                      <span
                        className="font-heading text-sm font-extrabold tabular-nums"
                        style={{ color: getScoreColor(item.data.overallScore) }}
                      >
                        {item.data.overallScore}
                      </span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Trend comparison */}
      {healthDataMap.length >= 2 && (
        <section className="mb-10">
          <h2 className="font-heading font-bold text-sm uppercase tracking-wider text-foreground mb-4">
            Historical Trend Comparison
          </h2>
          <div className="bg-white border-2 border-foreground rounded-xl p-6 shadow-card">
            <div className="space-y-4">
              {healthDataMap.map((item) => (
                <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                  <div className="w-40 flex-shrink-0">
                    <p className="text-sm font-heading font-bold text-foreground">{item.country.flag} {item.country.name}</p>
                  </div>
                  <div className="flex-1">
                    <TrendChart data={item.data.historicalScores} color={getScoreColor(item.data.overallScore)} height={100} />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
              {healthDataMap.map((item) => (
                <div key={item.id} className="flex items-center gap-1.5">
                  <span className="w-3 h-1 rounded-full" style={{ backgroundColor: getScoreColor(item.data.overallScore) }} />
                  <span className="text-xs text-muted-foreground font-body">{item.country.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </Shell>
  );
}
