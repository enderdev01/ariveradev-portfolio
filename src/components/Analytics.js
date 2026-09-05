import Script from "next/script";

// Self-hosted Umami. Renders nothing until both variables are set, so the
// site works unchanged while the analytics host is not yet deployed.
//
// NEXT_PUBLIC_UMAMI_URL         e.g. https://analytics.onilabs.site
// NEXT_PUBLIC_UMAMI_WEBSITE_ID  the id shown in the Umami dashboard
//
// The script path matches TRACKER_SCRIPT_NAME in analytics/.env — renaming it
// is what keeps ad blockers from matching Umami's default file name.
export default function Analytics() {
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
