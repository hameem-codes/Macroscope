import { useEffect, useState } from "react";
import GeometricDecoration from "@/components/geometric/GeometricDecoration";

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
    <div className="bg-white border-2 border-foreground rounded-xl p-6 shadow-card relative overflow-hidden h-full flex flex-col">
      <div className="absolute -top-4 -right-4 pointer-events-none">
        <GeometricDecoration variant="dots" color="#F472B6" size={80} />
      </div>
      <div className="mb-4">
        <h2 className="font-heading font-bold text-lg text-foreground uppercase tracking-wider flex items-center gap-2">
          <span>AI Executive Summary</span>
          <span className="text-[10px] bg-[#F472B6]/20 text-[#F472B6] px-2 py-0.5 rounded uppercase font-bold tracking-widest">
            Beta
          </span>
        </h2>
        <div className="w-12 h-1 bg-border mt-2" />
      </div>
      
      <div className="flex-1">
        {loading ? (
          <div className="flex flex-col justify-center h-full">
            <div className="animate-pulse flex flex-col gap-4 w-full mt-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        ) : summary.length > 0 ? (
          <ul className="space-y-4">
            {summary.map((bullet, idx) => (
              <li key={idx} className="flex gap-3 text-sm text-foreground font-body leading-relaxed">
                <span className="text-[#8B5CF6] font-bold shrink-0">{(idx + 1).toString().padStart(2, '0')}</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="h-full flex flex-col justify-center items-center text-center">
            <p className="text-muted-foreground font-body text-sm mb-2">
              AI insights are temporarily unavailable.
            </p>
            <p className="text-muted-foreground font-body text-sm">
              Your economic analysis and scores are still available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
