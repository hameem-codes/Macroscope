import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFFDF5",
        foreground: "#1E293B",
        muted: "#F1F5F9",
        "muted-foreground": "#64748B",
        accent: "#8B5CF6",
        "accent-foreground": "#FFFFFF",
        secondary: "#F472B6",
        tertiary: "#FBBF24",
        quaternary: "#34D399",
        border: "#E2E8F0",
        card: "#FFFFFF",
        input: "#FFFFFF",
        ring: "#8B5CF6",
        violet: "#8B5CF6",
        pink: "#F472B6",
        amber: "#FBBF24",
        mint: "#34D399",
        blue: "#60A5FA",
      },
      fontFamily: {
        heading: ["Outfit", "sans-serif"],
        body: ["Plus Jakarta Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        hard: "4px 4px 0 #1E293B",
        "hard-lg": "8px 8px 0 #1E293B",
        "hard-sm": "2px 2px 0 #1E293B",
        "card": "8px 8px 0 #E2E8F0",
        "card-hover": "12px 12px 0 #E2E8F0",
        "accent": "4px 4px 0 #8B5CF6",
        "pink": "4px 4px 0 #F472B6",
        "amber": "4px 4px 0 #FBBF24",
        "mint": "4px 4px 0 #34D399",
      },
      animation: {
        "barometer-fill": "barometerFill 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "count-up": "countUp 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "pop-in": "popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
      },
      keyframes: {
        barometerFill: {
          "0%": { strokeDashoffset: "251.2" },
          "100%": { strokeDashoffset: "var(--target-offset)" },
        },
        countUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        popIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
