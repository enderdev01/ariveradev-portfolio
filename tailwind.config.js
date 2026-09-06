/** @type {import('tailwindcss').Config} */
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
        burtons: ["burtons", "sans-serif"],
        quantico: ["var(--font-quantico)"],
      },
      colors: {
        background: "#FFFFFF",
        surface: "#F8FAFC",
        "surface-alt": "#F1F5F9",
        baseEsp: "#F9F7F2",

        "text-primary": "#0F172A",
        "text-secondary": "#334155",
        "text-muted": "#5B6A7D",

        primary: "#2563EB",
        "primary-soft": "#DBEAFE",
        "primary-dark": "#1E40AF",

        accent: "#0EA5E9",
        "accent-soft": "#E0F2FE",
        // Text-safe accent: #0EA5E9 is 2.77:1 on white and fails WCAG AA.
        "accent-strong": "#0369A1",

        success: "#16A34A",
        // Text-safe success: #16A34A is 2.79:1 on the success/10 tint and fails AA.
        "success-strong": "#166534",
        warning: "#F59E0B",
        error: "#DC2626",

        border: "#E2E8F0",
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
  plugins: [],
};
