"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import Header from "@/components/header/Header";
import SearchCommand from "@/components/search/SearchCommand";

import { useCountry } from "@/context/CountryContext";
import { usePathname } from "next/navigation";

interface ShellProps {
  children: React.ReactNode;
}

export default function Shell({
  children,
}: ShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  
  const { countryId, setCountryId } = useCountry();
  const pathname = usePathname();
  const hideCountrySelector = pathname === "/compare" || pathname === "/global";

  // Global keyboard shortcut
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          selectedCountry={countryId}
          onCountryChange={setCountryId}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          onSearchOpen={() => setSearchOpen(true)}
          hideCountrySelector={hideCountrySelector}
        />

        <main className="flex-1 overflow-y-auto" role="main">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
            {children}
          </div>
        </main>
      </div>

      <SearchCommand isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
