"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface CountryContextType {
  countryId: string;
  setCountryId: (id: string) => void;
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);

export function CountryProvider({ children }: { children: ReactNode }) {
  const [countryId, setCountryId] = useState("us");

  return (
    <CountryContext.Provider value={{ countryId, setCountryId }}>
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
