import { CountryData } from "@/lib/types";

export const countries: CountryData[] = [
  { id: "us", name: "United States", flag: "🇺🇸", code: "US" },
  { id: "in", name: "India", flag: "🇮🇳", code: "IN" },
  { id: "cn", name: "China", flag: "🇨🇳", code: "CN" },
  { id: "de", name: "Germany", flag: "🇩🇪", code: "DE" },
  { id: "gb", name: "United Kingdom", flag: "🇬🇧", code: "GB" },
  { id: "jp", name: "Japan", flag: "🇯🇵", code: "JP" },
  { id: "fr", name: "France", flag: "🇫🇷", code: "FR" },
  { id: "ca", name: "Canada", flag: "🇨🇦", code: "CA" },
  { id: "au", name: "Australia", flag: "🇦🇺", code: "AU" },
  { id: "br", name: "Brazil", flag: "🇧🇷", code: "BR" },
];

export function getCountryById(id: string): CountryData | undefined {
  return countries.find((c) => c.id === id);
}
