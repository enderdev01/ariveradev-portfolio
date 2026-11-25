import { useRef } from "react";

// An iPhone drawn from real geometry (ported from the Stageshow kit's Phone):
// the screen is laid out at true iOS points, 402 × 874, and scaled down as a
// whole, so type inside renders at the size iOS uses (17pt body) instead of
// 8px. Status bar 62pt tall, Dynamic Island 95 × 37 at 14pt from the top, home
// indicator 144 × 5 at 8pt from the bottom. `--ps` is the points-to-pixels
// scale per breakpoint. The frame is sized in px, not rem: the site's root
// font size changes on phones and would thicken one side of the bezel.
//
// - `dark`: white status bar and home indicator, for dark screens.
// - `chrome={false}`: no status bar or island (for a screenshot that brings
//   its own top). Content always starts below the 62pt status bar when chrome
//   is on, so nothing sits under the island.
// - `back`: an app name ("Safari") shown in place of the time, as iOS does
//   when another app opened this one.
export default function Phone({ children, className = "", dark = false, chrome = true, back = null }) {
  const ink = dark ? "text-white" : "text-black";
  // Keeps the label while it fades out, so it doesn't blank mid-transition.
  const lastBack = useRef(back);
  if (back) lastBack.current = back;
  return (
    <div
      className={`mx-auto w-[calc(402px*var(--ps)_+_20px)] rounded-[calc(64px*var(--ps)_+_10px)] bg-text-primary p-[10px] shadow-[0_32px_64px_-24px_rgba(19,26,39,0.55)] [--ps:0.607] sm:[--ps:0.6866] lg:[--ps:0.7264] ${className}`.trim()}
    >
      {/* clip-path, not only overflow + radius: WebKit lets transformed,
          animating layers (the sliding screens) paint past a rounded
          overflow clip. */}
      <div className="relative isolate h-[calc(874px*var(--ps))] w-[calc(402px*var(--ps))] overflow-hidden rounded-[calc(64px*var(--ps))] [clip-path:inset(0_round_calc(64px*var(--ps)))]">
        <div className="absolute left-0 top-0 h-[874px] w-[402px] origin-top-left [transform:scale(var(--ps))]">
          {chrome && (
            <div className={`pointer-events-none absolute inset-x-0 top-0 z-30 h-[62px] ${ink}`} aria-hidden="true">
              <span
                className="absolute left-0 top-[21.5px] w-[138.5px] text-center font-[system-ui] text-[17.67px] font-semibold leading-[22px] transition-opacity duration-200"
                style={{ opacity: back ? 0 : 1 }}
              >
                9:41
              </span>
              {/* iOS replaces the time with a way back to the app that opened this one. */}
              <span
                className="absolute left-0 top-[21.5px] flex h-[22px] w-[138.5px] items-center justify-center gap-0.5 font-[system-ui] text-[14px] font-semibold transition-opacity duration-200"
                style={{ opacity: back ? 1 : 0 }}
              >
                <svg viewBox="0 0 8 13" width="7" height="11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6.5 1.5 1.5 6.5l5 5" />
                </svg>
                {back || lastBack.current}
              </span>
              <span className="absolute left-[285.25px] top-[25.33px] flex items-start gap-2">
                <Signal />
                <Wifi />
                <Battery />
              </span>
              <span className="absolute left-1/2 top-[14px] h-[37px] w-[95px] -translate-x-1/2 rounded-[18.5px] bg-black" />
            </div>
          )}
          <div className="absolute inset-0">{children}</div>
          {chrome && (
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute bottom-[8px] left-1/2 z-30 h-[5px] w-[144px] -translate-x-1/2 rounded-full ${dark ? "bg-white" : "bg-black"}`}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Status bar glyphs, from Apple's iOS UI kit via the Stageshow kit: exact
// paths and sizes in points.
function Signal() {
  return (
    <svg viewBox="0 0 20.33 13.67" width="20.33" height="13.67" className="mt-px">
      {[6.33, 8.67, 11, 13.67].map((h, i) => (
        <rect key={i} x={i * 5.667} y={13.67 - h} width={3.333} height={h} rx={1.667} fill="currentColor" />
      ))}
    </svg>
  );
}

function Wifi() {
  return (
    <svg viewBox="0 0 19.33 14.33" width="19.33" height="14.33">
      <path
        fillRule="evenodd"
        fill="currentColor"
        d="M0.415933 5.54283C0.902185 6.04412 1.66017 5.95818 2.27513 5.41393C4.30595 3.58064 6.83731 2.63535 9.66901 2.63535C12.5007 2.63535 15.0464 3.60928 17.0629 5.41393C17.6636 5.97251 18.4215 6.0298 18.9221 5.54283C19.4226 5.02722 19.4942 4.2538 18.9793 3.70954C16.8341 1.51819 13.3302 0 9.66901 0C6.00783 0 2.48965 1.53251 0.358727 3.72387C-0.156127 4.2538 -0.0989213 5.02722 0.415933 5.55715L0.415933 5.54283ZM3.94841 9.13779C4.50617 9.68205 5.22124 9.62476 5.85051 9.10915C6.88022 8.29276 8.25316 7.73418 9.66901 7.7485C11.0706 7.7485 12.4435 8.29276 13.4875 9.12347C14.1168 9.63908 14.8605 9.66773 15.4039 9.12347C15.9331 8.57921 16.0189 7.7485 15.4611 7.23289C14.0739 5.98683 11.9859 5.11315 9.68332 5.11315C7.38077 5.11315 5.27845 5.98683 3.9055 7.23289C3.41925 7.69121 3.31914 8.47896 3.96271 9.13779L3.94841 9.13779ZM8.72511 13.8929C9.34008 14.4801 9.98365 14.4801 10.5986 13.8929L11.757 12.7757C12.372 12.1742 12.5007 11.4151 11.7999 10.8995C11.2136 10.4841 10.4699 10.212 9.66901 10.212C8.86813 10.212 8.11015 10.4841 7.53809 10.9138C6.83731 11.4151 6.98033 12.1885 7.59529 12.7757L8.73942 13.8929L8.72511 13.8929Z"
      />
    </svg>
  );
}

function Battery() {
  return (
    <svg viewBox="0 0 29.33 13.67" width="29.33" height="13.67">
      <path
        fill="currentColor"
        d="M0 6.4C0 4.15979 0 3.03969 0.435974 2.18404C0.819467 1.43139 1.43139 0.819467 2.18404 0.435974C3.03969 0 4.15979 0 6.4 0L19.933 0C22.1732 0 23.2933 0 24.149 0.435974C24.9016 0.819467 25.5135 1.43139 25.897 2.18404C26.333 3.03969 26.333 4.15979 26.333 6.4L26.333 7.26666C26.333 9.50687 26.333 10.627 25.897 11.4826C25.5135 12.2353 24.9016 12.8472 24.149 13.2307C23.2933 13.6667 22.1732 13.6667 19.933 13.6667L6.4 13.6667C4.15979 13.6667 3.03969 13.6667 2.18404 13.2307C1.43139 12.8472 0.819467 12.2353 0.435974 11.4826C0 10.627 0 9.50687 0 7.26666L0 6.4Z"
      />
      <path fillRule="evenodd" fill="currentColor" transform="translate(27.33 4.33)" d="M0 0L0 5C0.601505 4.8625 2 3.75 2 2.5C2 1.25 0.601505 0.1375 0 0Z" />
    </svg>
  );
}
