"use client";

import { useState, useRef, useEffect } from "react";
import { countries } from "@/data/countries";

interface HeaderProps {
  selectedCountry: string;
  onCountryChange: (countryId: string) => void;
  onMenuToggle: () => void;
  onSearchOpen: () => void;
}

export default function Header({
  selectedCountry,
  onCountryChange,
  onMenuToggle,
  onSearchOpen,
}: HeaderProps) {
  const [countryOpen, setCountryOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentCountry = countries.find((c) => c.id === selectedCountry) || countries[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCountryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white border-b-2 border-foreground flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      {/* Left: Menu + Brand (mobile) */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 -ml-2 hover:bg-muted rounded-lg"
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        <div className="hidden lg:flex items-center gap-2">
          <span className="font-heading text-lg font-extrabold tracking-tight">ECONOMIC</span>
          <span className="font-heading text-lg font-bold text-accent">/51</span>
        </div>
      </div>

      {/* Center: Country selector */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setCountryOpen(!countryOpen)}
          className="flex items-center gap-2 px-3 py-2 border-2 border-foreground rounded-lg hover:bg-muted transition-colors text-sm font-medium"
          aria-haspopup="listbox"
          aria-expanded={countryOpen}
        >
          <span className="text-lg">{currentCountry.flag}</span>
          <span>{currentCountry.name}</span>
          <svg className={`w-4 h-4 transition-transform ${countryOpen ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
          </svg>
        </button>

        {countryOpen && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-white border-2 border-foreground rounded-lg shadow-hard overflow-hidden z-50">
            <div className="p-1">
              {countries.map((country) => (
                <button
                  key={country.id}
                  onClick={() => {
                    onCountryChange(country.id);
                    setCountryOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-left
                    transition-colors
                    ${country.id === selectedCountry
                      ? "bg-accent/10 text-accent font-semibold"
                      : "hover:bg-muted text-foreground"
                    }
                  `}
                  role="option"
                  aria-selected={country.id === selectedCountry}
                >
                  <span className="text-lg">{country.flag}</span>
                  <span>{country.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right: Search + Status */}
      <div className="flex items-center gap-2">
        <button
          onClick={onSearchOpen}
          className="flex items-center gap-2 px-3 py-2 border-2 border-border rounded-lg hover:bg-muted transition-colors text-sm text-muted-foreground"
          aria-label="Search"
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" />
          </svg>
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden sm:inline text-[10px] border border-border rounded px-1.5 py-0.5 bg-muted">
            ⌘K
          </kbd>
        </button>

        <div className="flex items-center gap-2 text-xs text-muted-foreground border-2 border-border rounded-lg px-3 py-2">
          <span className="w-2 h-2 rounded-full bg-quaternary" />
          <span className="hidden sm:inline">Aug 2026</span>
        </div>
      </div>
    </header>
  );
}
