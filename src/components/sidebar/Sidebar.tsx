"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { categories } from "@/data/categories";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Overview", icon: "◉" },
    { href: "/compare", label: "Compare", icon: "⚡" },
    { href: "/global", label: "Global Ranking", icon: "🌍" },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r-2 border-foreground z-50
          transform transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Brand */}
        <div className="p-5 border-b-2 border-foreground">
          <Link href="/" className="block" onClick={onClose}>
            <div className="font-heading">
              <span className="text-lg font-extrabold tracking-tight text-foreground">
                ECONOMIC
              </span>
              <span className="text-lg font-bold text-accent ml-1">/51</span>
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">
              Intelligence Dashboard
            </p>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-semibold px-3 pt-3 pb-2">
            Navigation
          </p>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`
                sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                ${
                  pathname === item.href
                    ? "active bg-accent/10 text-accent"
                    : "text-foreground hover:bg-muted"
                }
              `}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Categories */}
        <div className="p-3 space-y-1">
          <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-semibold px-3 pt-4 pb-2">
            Categories
          </p>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              onClick={onClose}
              className={`
                sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                ${
                  pathname === `/category/${cat.slug}`
                    ? "active"
                    : "text-foreground hover:bg-muted"
                }
              `}
            >
              <span
                className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                style={{ backgroundColor: cat.color }}
              />
              <span className="truncate">{cat.name}</span>
            </Link>
          ))}
        </div>

        {/* Data status */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t-2 border-foreground">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-amber animate-pulse" />
            <span>Sample Dataset</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">
            51 indicators · 8 categories
          </p>
        </div>
      </aside>
    </>
  );
}
