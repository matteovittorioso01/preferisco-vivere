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
        // PALETTE TRICOLORE (bandiera italiana, come il logo del club)
        // "lime" = token storico per l'accento primario → ora VERDE Italia
        lime: {
          DEFAULT: "#00A859",
          400: "#2BCB7C",
          600: "#008F4C",
        },
        // verde bandiera (pallini, dettagli)
        verde: {
          DEFAULT: "#009246",
          400: "#00B257",
          600: "#007A3B",
        },
        // ROSSO bandiera (accento secondario)
        rosso: {
          DEFAULT: "#D8333F",
          400: "#E25560",
          600: "#CE2B37",
        },
      },
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        lime: "0 0 50px -12px rgba(0,168,89,0.5)",
        "lime-sm": "0 0 24px -8px rgba(0,168,89,0.6)",
        verde: "0 0 50px -12px rgba(0,146,70,0.5)",
        rosso: "0 0 50px -12px rgba(216,51,63,0.5)",
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
