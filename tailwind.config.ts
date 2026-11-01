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
        airtech: {
          navy: "#10243A",       // Primary brand colour
          blue: "#245B85",       // Secondary brand colour
          charcoal: "#252B32",   // Main typography
          muted: "#737D87",      // Secondary typography
          offwhite: "#F5F6F4",   // Alternate background
          pale: "#E8F0F5",       // Subtle highlights
          red: "#C64A45",        // Restrained red emphasis
          dark: "#0B1827",       // Deep shadow navy
        },
        navy: {
          50: "#F4F7FA",
          100: "#E8F0F5",
          200: "#C8D9E6",
          300: "#9FBED3",
          400: "#6093B7",
          500: "#245B85",
          600: "#1C4869",
          700: "#173A54",
          800: "#10243A",
          900: "#0B1827",
          950: "#060D15",
        },
        steel: {
          50: "#F8F9FA",
          100: "#F5F6F4",
          200: "#E3E6E8",
          300: "#D1D6DA",
          400: "#A2ABB3",
          500: "#737D87",
          600: "#545D66",
          700: "#3B4249",
          800: "#252B32",
          900: "#15191D",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        display: ["var(--font-manrope)", "Manrope", "Plus Jakarta Sans", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "Courier New", "monospace"],
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(16, 36, 58, 0.05), 0 1px 2px -1px rgba(16, 36, 58, 0.05)",
        card: "0 2px 4px 0 rgba(16, 36, 58, 0.06), 0 1px 2px 0 rgba(16, 36, 58, 0.04)",
        panel: "0 4px 12px 0 rgba(16, 36, 58, 0.08)",
      },
      borderRadius: {
        sm: "0.125rem",
        DEFAULT: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
