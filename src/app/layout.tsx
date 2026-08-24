import type { Metadata } from "next";
import { CountryProvider } from "@/context/CountryContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "MACROSCOPE — Intelligence Dashboard",
  description:
    "Macroscope: sophisticated economic intelligence platform tracking indicators across 8 categories.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CountryProvider>
          {children}
        </CountryProvider>
      </body>
    </html>
  );
}
