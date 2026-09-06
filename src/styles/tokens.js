// Ai-Zome color tokens — single source of truth (design D2).
// Each value is a space-separated RGB channel triple so Tailwind can emit
// `rgb(var(--<name>) / <alpha-value>)` and `bg-primary/10` keeps working.
// `global` modules use the emitted `--<name>: rgb(var(--<name>-rgb))` alias.
module.exports = {
  background: "247 245 239", // #F7F5EF — washi base
  "bg-washi": "247 245 239", // #F7F5EF — explicit alias
  surface: "253 252 250", // #FDFCFA
  "surface-alt": "233 228 216", // #E9E4D8

  "text-primary": "23 26 35", // #171A23
  "text-secondary": "74 78 92", // #4A4E5C
  "text-muted": "107 111 125", // #6B6F7D

  primary: "34 52 94", // #22345E
  "primary-soft": "226 227 232", // #E2E3E8 — primary over washi at 10%

  accent: "62 110 150", // #3E6E96
  "accent-soft": "231 237 242", // #E7EDF2 — accent over washi at 10%

  seal: "166 58 46", // #A63A2E
  error: "166 58 46", // #A63A2E — resolves to seal, exactly one red (D3)

  success: "63 107 78", // #3F6B4E
  "success-strong": "40 74 52", // #284A34 — text-safe on success/10 tint
  warning: "184 134 59", // #B8863B — icons/borders only, never text
  "warning-strong": "138 97 31", // #8A611F — text-safe warning

  border: "216 211 197", // #D8D3C5 — warm hairline
};
