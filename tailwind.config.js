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
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      /* Radius scale with intent: controls get a small radius, containers a
         slightly larger one, and nothing goes past 10px except pills. */
      borderRadius: {
        lg: "6px",
        xl: "8px",
        "2xl": "10px",
        "3xl": "10px",
      },
      colors: {
        background: "#FFFFFF",
        surface: "#F6F7F9",
        "surface-alt": "#EEF1F4",
        baseEsp: "#F9F7F2",

        "text-primary": "#131A27",
        "text-secondary": "#3A4354",
        "text-muted": "#5B6A7D",

        primary: "#2457D6",
        "primary-soft": "#DDE6FA",
        "primary-dark": "#1C3F9C",

        accent: "#1597D3",
        "accent-soft": "#E2F0F8",
        // On dark surfaces only (hero tagline/dot).
        "accent-light": "#67C6EC",
        // Text-safe accent: #1597D3 fails WCAG AA as text on white.
        "accent-strong": "#0B6594",

        success: "#1A9A4C",
        // Text-safe success: #1A9A4C fails AA on the success/10 tint.
        "success-strong": "#1A5F37",
        warning: "#E89E17",
        error: "#CF3229",

        border: "#DFE3E9",
      },

      /* ===== Motion system tokens ===== */
      transitionDuration: {
        fast: "150ms",
        base: "250ms",
        slow: "500ms",
        /* Hover enters faster than it leaves — see globals.css. */
        "hover-in": "170ms",
        "hover-out": "260ms",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        loop: "cubic-bezier(0.45, 0, 0.55, 1)",
        /* Leaves rest at zero velocity, decelerates long. Use for anything a
           pointer drives; out-expo is for entrances only. */
        hover: "cubic-bezier(0.2, 0, 0, 1)",
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
