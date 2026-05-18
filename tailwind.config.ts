import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#05070d",
          cyan: "#22d3ee",
          indigo: "#818cf8",
          "cyan-dim": "#0891b2",
          "indigo-dim": "#6366f1",
        },
        surface: {
          DEFAULT: "#0d1117",
          raised: "#161b22",
          overlay: "#1c2128",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(ellipse at top, rgba(34,211,238,0.08) 0%, transparent 60%), radial-gradient(ellipse at bottom right, rgba(129,140,248,0.06) 0%, transparent 60%)",
        "card-gradient":
          "linear-gradient(135deg, rgba(34,211,238,0.04) 0%, rgba(129,140,248,0.04) 100%)",
      },
      boxShadow: {
        "cyan-glow": "0 0 24px rgba(34,211,238,0.18)",
        "indigo-glow": "0 0 24px rgba(129,140,248,0.18)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
