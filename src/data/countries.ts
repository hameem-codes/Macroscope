import { CountryData } from "@/lib/types";

export const countries: CountryData[] = [
  { id: "ar", name: "Argentina", flag: "🇦🇷", code: "AR", worldBankCode: "ARG", region: "Americas", g20Member: true },
  { id: "au", name: "Australia", flag: "🇦🇺", code: "AU", worldBankCode: "AUS", region: "Oceania", g20Member: true },
  { id: "br", name: "Brazil", flag: "🇧🇷", code: "BR", worldBankCode: "BRA", region: "Americas", g20Member: true },
  { id: "ca", name: "Canada", flag: "🇨🇦", code: "CA", worldBankCode: "CAN", region: "Americas", g20Member: true },
  { id: "cn", name: "China", flag: "🇨🇳", code: "CN", worldBankCode: "CHN", region: "Asia", g20Member: true },
  { id: "fr", name: "France", flag: "🇫🇷", code: "FR", worldBankCode: "FRA", region: "Europe", g20Member: true },
  { id: "de", name: "Germany", flag: "🇩🇪", code: "DE", worldBankCode: "DEU", region: "Europe", g20Member: true },
  { id: "in", name: "India", flag: "🇮🇳", code: "IN", worldBankCode: "IND", region: "Asia", g20Member: true },
  { id: "id", name: "Indonesia", flag: "🇮🇩", code: "ID", worldBankCode: "IDN", region: "Asia", g20Member: true },
  { id: "it", name: "Italy", flag: "🇮🇹", code: "IT", worldBankCode: "ITA", region: "Europe", g20Member: true },
  { id: "jp", name: "Japan", flag: "🇯🇵", code: "JP", worldBankCode: "JPN", region: "Asia", g20Member: true },
  { id: "mx", name: "Mexico", flag: "🇲🇽", code: "MX", worldBankCode: "MEX", region: "Americas", g20Member: true },
  { id: "ru", name: "Russia", flag: "🇷🇺", code: "RU", worldBankCode: "RUS", region: "Europe", g20Member: true },
  { id: "sa", name: "Saudi Arabia", flag: "🇸🇦", code: "SA", worldBankCode: "SAU", region: "Asia", g20Member: true },
  { id: "za", name: "South Africa", flag: "🇿🇦", code: "ZA", worldBankCode: "ZAF", region: "Africa", g20Member: true },
  { id: "kr", name: "South Korea", flag: "🇰🇷", code: "KR", worldBankCode: "KOR", region: "Asia", g20Member: true },
  { id: "tr", name: "Türkiye", flag: "🇹🇷", code: "TR", worldBankCode: "TUR", region: "Asia", g20Member: true },
  { id: "gb", name: "United Kingdom", flag: "🇬🇧", code: "GB", worldBankCode: "GBR", region: "Europe", g20Member: true },
  { id: "us", name: "United States", flag: "🇺🇸", code: "US", worldBankCode: "USA", region: "Americas", g20Member: true },
];

export function getCountryById(id: string): CountryData | undefined {
  return countries.find((c) => c.id.toLowerCase() === id.toLowerCase());
}
