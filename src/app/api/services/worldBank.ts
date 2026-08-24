import { allProviderIndicators } from "./indicatorsMapping";

const WB_API_BASE = "https://api.worldbank.org/v2";

export interface WBCountry {
  id: string; // e.g., "IND" (actually it's the iso2code often, but iso3 is also there. Let's look at standard)
  iso2Code: string;
  name: string;
  region: { id: string; iso2code: string; value: string };
  adminregion: { id: string; iso2code: string; value: string };
  incomeLevel: { id: string; iso2code: string; value: string };
  lendingType: { id: string; iso2code: string; value: string };
  capitalCity: string;
  longitude: string;
  latitude: string;
}

export async function getSupportedCountries(): Promise<{ id: string; name: string; code: string }[]> {
  try {
    const res = await fetch(`${WB_API_BASE}/country?format=json&per_page=350`, {
      next: { revalidate: 86400 } // Cache countries for a day
    });
    const data = await res.json();
    
    if (!data || data.length < 2) return [];

    const rawCountries: WBCountry[] = data[1];
    
    // Filter out regions/aggregates. In WB API, aggregates typically have region.id === "NA"
    return rawCountries
      .filter(c => c.region.id !== "NA")
      .map(c => ({
        id: c.iso2Code.toLowerCase(), // Use iso2code for dashboard ID compatibility if needed, or iso3
        name: c.name,
        code: c.id, // ISO3 code
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error("Failed to fetch WB countries:", error);
    return [];
  }
}

export interface WBIndicatorData {
  indicator: { id: string; value: string };
  country: { id: string; value: string };
  countryiso3code: string;
  date: string;
  value: number | null;
  unit: string;
  obs_status: string;
  decimal: number;
}

export async function getCountryData(countryIso3Code: string) {
  // Get all WB indicators we mapped
  const wbIndicators = allProviderIndicators.filter(i => i.source === "World Bank");
  const indicatorIds = wbIndicators.map(i => i.sourceIndicatorId).join(";");
  
  try {
    // Fetch recent data (e.g., last 5 years) to ensure we get the latest non-null value
    // source=2 is World Development Indicators
    const url = `${WB_API_BASE}/country/${countryIso3Code}/indicator/${indicatorIds}?format=json&source=2&per_page=2000&date=2018:2025`;
    
    const res = await fetch(url, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    const data = await res.json();
    if (!data || data.length < 2) return [];

    const rawData: WBIndicatorData[] = data[1];
    
    // Process the data: for each indicator, find the most recent non-null value
    const processedMap = new Map<string, { current: WBIndicatorData; previous: WBIndicatorData | null }>();
    
    // Group by indicator ID
    const grouped = rawData.reduce((acc, curr) => {
      if (curr.value !== null) {
        if (!acc[curr.indicator.id]) acc[curr.indicator.id] = [];
        acc[curr.indicator.id].push(curr);
      }
      return acc;
    }, {} as Record<string, WBIndicatorData[]>);

    wbIndicators.forEach(mapping => {
      const observations = grouped[mapping.sourceIndicatorId];
      if (observations && observations.length > 0) {
        // Sort by date descending
        observations.sort((a, b) => parseInt(b.date) - parseInt(a.date));
        processedMap.set(mapping.id, {
          current: observations[0],
          previous: observations.length > 1 ? observations[1] : null
        });
      }
    });

    return Array.from(processedMap.entries()).map(([mappingId, obs]) => {
      const mapping = wbIndicators.find(m => m.id === mappingId)!;
      return {
        mapping,
        currentObservation: obs.current,
        previousObservation: obs.previous
      };
    });

  } catch (error) {
    console.error(`Failed to fetch WB data for ${countryIso3Code}:`, error);
    return [];
  }
}
