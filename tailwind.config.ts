import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0A0B0D",
          900: "#0A0B0D",
          800: "#101214",
          700: "#16191d",
          600: "#1d2127",
        },
        // GIALLO Caivano (token storico "lime" = accento primario)
        lime: {
          DEFAULT: "#FFD60A",
          400: "#FFE45C",
          600: "#E6BE00",
        },
        // VERDE Caivano (accento secondario)
        verde: {
          DEFAULT: "#22C55E",
          400: "#4ADE80",
          600: "#16A34A",
        },
      },
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        lime: "0 0 50px -12px rgba(255,214,10,0.5)",
        "lime-sm": "0 0 24px -8px rgba(255,214,10,0.6)",
        verde: "0 0 50px -12px rgba(34,197,94,0.5)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 28s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
