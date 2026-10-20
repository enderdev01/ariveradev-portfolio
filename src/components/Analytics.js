import Script from "next/script";
import { GA_MEASUREMENT_ID } from "../lib/gtag";

// Google Analytics 4. Production only, so local development and preview
// builds do not pollute the property. Enhanced measurement covers the
// client-side route changes of the pages router, so no manual page_view here.
function GoogleAnalytics() {
  if (process.env.NODE_ENV !== "production" || !GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}

// Self-hosted Umami. Renders nothing until both variables are set, so the
// site works unchanged while the analytics host is not yet deployed.
//
// NEXT_PUBLIC_UMAMI_URL         e.g. https://analytics.onilabs.site
// NEXT_PUBLIC_UMAMI_WEBSITE_ID  the id shown in the Umami dashboard
//
// The script path matches TRACKER_SCRIPT_NAME in analytics/.env — renaming it
// is what keeps ad blockers from matching Umami's default file name.
function Umami() {
  const host = process.env.NEXT_PUBLIC_UMAMI_URL;
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

  if (!host || !websiteId) return null;

  return (
    <Script
      src={`${host.replace(/\/$/, "")}/metrics.js`}
      data-website-id={websiteId}
      strategy="afterInteractive"
    />
  );
}

export default function Analytics() {
  return (
    <>
      <GoogleAnalytics />
      <Umami />
    </>
  );
}
