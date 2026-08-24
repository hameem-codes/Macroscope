"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { categories } from "@/data/categories";
import { countries } from "@/data/countries";
import { indicatorDefinitions } from "@/data/indicators";

interface SearchCommandProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchCommand({ isOpen, onClose }: SearchCommandProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Parent handles opening
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    if (!query.trim()) return { categories: [], indicators: [], countries: [] };
    const q = query.toLowerCase();

    return {
      categories: categories.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      ),
      indicators: indicatorDefinitions.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q)
      ),
      countries: countries.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q)
      ),
    };
  }, [query]);

  const totalResults =
    results.categories.length +
    results.indicators.length +
    results.countries.length;

  function navigateTo(type: string, slug: string) {
    onClose();
    if (type === "category") router.push(`/category/${slug}`);
    else if (type === "indicator") {
      // Find category for indicator
      const ind = indicatorDefinitions.find((i) => i.id === slug);
      if (ind) router.push(`/category/${ind.categorySlug}`);
    } else if (type === "country") {
      router.push("/");
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 search-overlay" onClick={onClose}>
      <div className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-lg px-4" onClick={(e) => e.stopPropagation()}>
        <div className="bg-white border-2 border-foreground rounded-xl shadow-hard-lg overflow-hidden">
          {/* Input */}
          <div className="flex items-center gap-3 px-4 border-b-2 border-foreground">
            <svg className="w-5 h-5 text-muted-foreground flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search indicators, categories, countries..."
              className="flex-1 py-4 text-sm font-body outline-none bg-transparent text-foreground placeholder:text-muted-foreground"
              aria-label="Search"
            />
            <kbd className="text-[10px] border border-border rounded px-1.5 py-0.5 bg-muted text-muted-foreground">
              ESC
            </kbd>
          </div>

          {/* Results */}
          {query.trim() && (
            <div className="max-h-80 overflow-y-auto p-2">
              {totalResults === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground font-body">
                  No results found for &ldquo;{query}&rdquo;
                </div>
              ) : (
                <div className="space-y-2">
                  {results.categories.length > 0 && (
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-heading font-bold px-3 py-1.5">
                        Categories
                      </p>
                      {results.categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => navigateTo("category", cat.slug)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted text-left transition-colors"
                        >
                          <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: cat.color }} />
                          <div>
                            <p className="text-sm font-medium text-foreground">{cat.name}</p>
                            <p className="text-xs text-muted-foreground">{cat.description}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {results.indicators.length > 0 && (
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-heading font-bold px-3 py-1.5">
                        Indicators
                      </p>
                      {results.indicators.slice(0, 8).map((ind) => (
                        <button
                          key={ind.id}
                          onClick={() => navigateTo("indicator", ind.id)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted text-left transition-colors"
                        >
                          <svg className="w-4 h-4 text-muted-foreground flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M15.98 1.804a1 1 0 00-1.96 0l-.24 1.192a1 1 0 01-.784.785l-1.192.238a1 1 0 000 1.962l1.192.238a1 1 0 01.785.785l.238 1.192a1 1 0 001.962 0l.238-1.192a1 1 0 01.785-.785l1.192-.238a1 1 0 000-1.962l-1.192-.238a1 1 0 01-.785-.785l-.238-1.192z" />
                          </svg>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{ind.name}</p>
                            <p className="text-xs text-muted-foreground">{ind.categorySlug}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {results.countries.length > 0 && (
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-heading font-bold px-3 py-1.5">
                        Countries
                      </p>
                      {results.countries.map((country) => (
                        <button
                          key={country.id}
                          onClick={() => navigateTo("country", country.id)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted text-left transition-colors"
                        >
                          <span className="text-lg">{country.flag}</span>
                          <p className="text-sm font-medium text-foreground">{country.name}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Quick links when empty */}
          {!query.trim() && (
            <div className="p-4">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-heading font-bold mb-2">
                Quick Actions
              </p>
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 4).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => navigateTo("category", cat.slug)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-xs font-medium hover:bg-muted transition-colors"
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
