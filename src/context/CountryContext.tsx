"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface CountryContextType {
  countryId: string;
  setCountryId: (id: string) => void;
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);

export function CountryProvider({ children }: { children: ReactNode }) {
  const [countryId, setCountryId] = useState("us");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("selectedCountryId");
      if (saved) {
        setCountryId(saved);
      }
    }
  }, []);

  const handleSetCountryId = (id: string) => {
    setCountryId(id);
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedCountryId", id);
    }
  };

  return (
    <CountryContext.Provider value={{ countryId, setCountryId: handleSetCountryId }}>
      {children}
    </CountryContext.Provider>
  );
}

export function useCountry() {
  const context = useContext(CountryContext);
  if (context === undefined) {
    throw new Error("useCountry must be used within a CountryProvider");
  }
  return context;
}
