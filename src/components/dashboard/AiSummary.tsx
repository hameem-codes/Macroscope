"use client";

import { useEffect, useState } from "react";
import GeometricDecoration from "@/components/geometric/GeometricDecoration";

function formatInsightText(text: string) {
  // Check for Markdown bold (**text**)
  const mdMatch = text.match(/^\*\*(.*?)\*\*(.*)/);
  if (mdMatch) {
    return (
      <>
        <strong className="text-foreground">{mdMatch[1]}</strong>
        <span className="text-muted-foreground">{mdMatch[2]}</span>
      </>
    );
  }

  // Check for colon separator up to 60 chars
  const colonIndex = text.indexOf(":");
  if (colonIndex > 0 && colonIndex < 60) {
    return (
      <>
        <strong className="text-foreground">{text.substring(0, colonIndex + 1)}</strong>
        <span className="text-muted-foreground">{text.substring(colonIndex + 1)}</span>
      </>
    );
  }

  return <span className="text-muted-foreground">{text}</span>;
}

const ACCENT_COLORS = [
  "#8B5CF6",
  "#F472B6",
  "#34D399",
  "#FBBF24",
  "#60A5FA",
];

export default function AiSummary({ countryId }: { countryId: string }) {
  const [summary, setSummary] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSummary() {
      setLoading(true);
      try {
        const res = await fetch(`/api/countries/${countryId}/ai-summary`);
        const data = await res.json();

        if (data.success && data.summary) {
          setSummary(data.summary);
        } else {
          setSummary([]);
        }
      } catch (error) {
        console.error("Failed to fetch AI summary", error);
        setSummary([]);
      } finally {
        setLoading(false);
      }
    }
    fetchSummary();
  }, [countryId]);

  return (
    <div className="flex flex-col h-full">
      {/* Section header — matches Trend Chart header */}
      <div className="flex items-center gap-3 mb-5">
        <h2 className="font-heading font-bold text-lg text-foreground uppercase tracking-wider">
          AI Insights
        </h2>
        <span className="text-[10px] bg-[#F472B6]/20 text-[#F472B6] px-2 py-0.5 rounded uppercase font-bold tracking-widest shrink-0">
          Beta
        </span>
        <div className="flex-1 h-0.5 bg-border" />
      </div>

      {/* Card */}
      <div className="bg-white border-2 border-foreground rounded-xl p-6 shadow-card relative overflow-hidden flex-1 flex flex-col min-h-0">
        {/* Decoration */}
        <div className="absolute -top-4 -right-4 pointer-events-none">
          <GeometricDecoration variant="dots" color="#F472B6" size={80} />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar relative z-10">
          {loading ? (
            <div className="animate-pulse flex flex-col gap-4 pt-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="h-5 w-6 bg-gray-200 rounded shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div
                      className="h-3.5 bg-gray-200 rounded"
                      style={{ width: `${75 + (i % 3) * 8}%` }}
                    />
                    <div
                      className="h-3.5 bg-gray-100 rounded"
                      style={{ width: `${55 + (i % 4) * 8}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : summary.length > 0 ? (
            <ul className="space-y-4 pb-2 pt-1">
              {summary.map((bullet, idx) => (
                <li
                  key={idx}
                  className="flex gap-3 text-sm font-body leading-relaxed"
                >
                  {/* Index pill */}
                  <span
                    className="shrink-0 mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ backgroundColor: ACCENT_COLORS[idx % ACCENT_COLORS.length] }}
                  >
                    {idx + 1}
                  </span>
                  {/* Text */}
                  <span className="flex-1 leading-relaxed">
                    {formatInsightText(bullet)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="h-full flex flex-col justify-center items-center text-center gap-2 py-8">
              <span className="text-3xl">🤖</span>
              <p className="text-muted-foreground font-body text-sm font-medium">
                AI insights are temporarily unavailable.
              </p>
              <p className="text-muted-foreground font-body text-xs">
                Your economic analysis and scores are still available below.
              </p>
            </div>
          )}
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #E2E8F0;
            border-radius: 10px;
          }
          .custom-scrollbar:hover::-webkit-scrollbar-thumb {
            background-color: #CBD5E1;
          }
        `}} />
      </div>
    </div>
  );
}
