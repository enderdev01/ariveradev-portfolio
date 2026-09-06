/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");
const tokens = require("./src/styles/tokens");

const colorEntries = Object.fromEntries(
  Object.entries(tokens).map(([name, triple]) => [
    name,
    `rgb(var(--${name}-rgb) / <alpha-value>)`,
  ]),
);

module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Archivo Black", "Noto Sans JP", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        sans: ["Noto Sans", "Noto Sans JP", "system-ui", "sans-serif"],
      },
      colors: {
        ...colorEntries,
      },

      /* ===== Motion system tokens ===== */
      transitionDuration: {
        fast: "150ms",
        base: "250ms",
        slow: "500ms",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        loop: "cubic-bezier(0.45, 0, 0.55, 1)",
      },
      animation: {
        "fade-up": "fade-up 500ms cubic-bezier(0.16,1,0.3,1) both",
        "fade-in": "fade-in 500ms cubic-bezier(0.16,1,0.3,1) both",
        "scale-in": "scale-in 250ms cubic-bezier(0.16,1,0.3,1) both",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [
    plugin(({ addBase }) => {
      const vars = {};
      for (const [name, triple] of Object.entries(tokens)) {
        vars[`--${name}-rgb`] = triple;
        vars[`--${name}`] = `rgb(var(--${name}-rgb))`;
      }
      addBase({ ":root": vars });
    }),
  ],
};
