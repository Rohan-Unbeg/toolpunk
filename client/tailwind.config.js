// tailwind.config.js
export default {
    content: [
      "./index.html",             // Vite needs this
      "./src/**/*.{js,jsx,ts,tsx}" // Covers components, pages, context, etc.
    ],
    theme: {
      extend: {
        colors: {
          // Primary color shades (Indigo)
          primary: {
            50: "#eef2ff",
            100: "#e0e7ff",
            200: "#c7d2fe",
            300: "#a5b4fc",
            400: "#818cf8",
            500: "#6366f1",
            600: "#4f46e5", // Base primary
            700: "#4338ca",
            800: "#3730a3",
            900: "#312e81",
          },
          // Secondary color shades (Violet)
          secondary: {
            50: "#f5f3ff",
            100: "#ede9fe",
            200: "#ddd6fe",
            300: "#c4b5fd",
            400: "#a78bfa",
            500: "#8b5cf6", // Base secondary
            600: "#7c3aed",
            700: "#6d28d9",
            800: "#5b21b6",
            900: "#4c1d95",
          },
          // Accent color shades (Amber)
          accent: {
            50: "#fffbeb",
            100: "#fef3c7",
            200: "#fde68a",
            300: "#fcd34d",
            400: "#fbbf24", // Base accent
            500: "#f59e0b",
            600: "#d97706",
            700: "#b45309",
            800: "#92400e",
            900: "#78350f",
          },
          // Neutral/Gray color shades (Slate)
          neutral: {
            50: "#f8fafc",
            100: "#f1f5f9",
            200: "#e2e8f0",
            300: "#cbd5e1",
            400: "#94a3b8",
            500: "#64748b",
            600: "#475569",
            700: "#334155",
            800: "#1e293b",
            900: "#0f172a",
          },
          // Error color shades (Red)
          error: {
            50: "#fef2f2",
            100: "#fee2e2",
            200: "#fecaca",
            300: "#fca5a5",
            400: "#f87171",
            500: "#ef4444",
            600: "#dc2626",
            700: "#b91c1c",
            800: "#991b1b",
            900: "#7f1d1d",
          },
          // Success color shades (Green)
          success: {
            50: "#f0fdf4",
            100: "#dcfce7",
            200: "#bbf7d0",
            300: "#86efac",
            400: "#4ade80",
            500: "#22c55e",
            600: "#16a34a",
            700: "#15803d",
            800: "#166534",
            900: "#14532d",
          },
          // Warning color shades (Amber)
          warning: {
            50: "#fffbeb",
            100: "#fef3c7",
            200: "#fde68a",
            300: "#fcd34d",
            400: "#fbbf24",
            500: "#f59e0b",
            600: "#d97706",
            700: "#b45309",
            800: "#92400e",
            900: "#78350f",
          },
          // Info color shades (Cyan)
          info: {
            50: "#ecfeff",
            100: "#cffafe",
            200: "#a5f3fc",
            300: "#67e8f9",
            400: "#22d3ee",
            500: "#06b6d4",
            600: "#0891b2",
            700: "#0e7490",
            800: "#155e75",
            900: "#164e63",
          },
        },
        stroke: {
          primary: "#4f46e5",
          secondary: "#8b5cf6",
          accent: "#fbbf24",
          error: "#ef4444",
          success: "#22c55e",
          warning: "#f59e0b",
          info: "#06b6d4",
        },
        backgroundImage: {
          "grid-indigo":
            "linear-gradient(to right, rgba(99, 102, 241, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(99, 102, 241, 0.1) 1px, transparent 1px)",
        },
      },
    },
  };
  export const plugins = [];
  