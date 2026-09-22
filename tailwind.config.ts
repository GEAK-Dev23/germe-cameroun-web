import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        germe: {
          green: "#4C9A4A",
          greenDark: "#357A38",
          greenLight: "#E7F3E5",
          blue: "#0F4C81",
          blueDark: "#0A3A63",
          blueLight: "#E5EEF6",
          wheat: "#F2DBA0",
          cream: "#FAF9F6",
          ink: "#1C2B1F",
        },
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Inter'", "sans-serif"],
      },
      keyframes: {
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "drift-cloud-1": {
          "0%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(30px)" },
          "100%": { transform: "translateX(0)" },
        },
        "drift-cloud-2": {
          "0%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(-24px)" },
          "100%": { transform: "translateX(0)" },
        },
        "drive-in": {
          "0%": { transform: "translateX(-60px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "bounce-soft": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-3px)" },
        },
        sway: {
          "0%, 100%": { transform: "rotate(-1.5deg)" },
          "50%": { transform: "rotate(1.5deg)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "hero-zoom": {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.08)" },
        },
        "menu-pop": {
          "0%": { opacity: "0", transform: "scale(0.95) translateY(-8px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        "modal-fade": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        ripple: {
          "0%": { transform: "scale(0.75)", opacity: "0.55" },
          "80%": { opacity: "0" },
          "100%": { transform: "scale(1.9)", opacity: "0" },
        },
      },
      animation: {
        "spin-slow": "spin-slow 9s linear infinite",
        "drift-cloud-1": "drift-cloud-1 14s ease-in-out infinite",
        "drift-cloud-2": "drift-cloud-2 18s ease-in-out infinite",
        "drive-in": "drive-in 1.4s ease-out forwards",
        "bounce-soft": "bounce-soft 2.4s ease-in-out infinite",
        sway: "sway 4s ease-in-out infinite",
        "fade-up": "fade-up 0.7s ease-out forwards",
        "hero-zoom": "hero-zoom 20s ease-out forwards",
        "menu-pop": "menu-pop 0.18s ease-out forwards",
        "modal-fade": "modal-fade 0.2s ease-out forwards",
        ripple: "ripple 3s cubic-bezier(0.25,0.6,0.4,1) infinite",
      },
    },
  },
  plugins: [],
};
export default config;
