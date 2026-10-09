"use client";

import { IS_STAGING } from "@/lib/base-path";
import Script from "next/script";

// Cloudflare Web Analytics: cookieless page-view stats for isagog.com.
// AnalyticsConsent mounts this only after the visitor agrees.
// The token is public by design — it ships in every page's HTML anyway.
// Cloudflare matches the site's hostname by suffix, so a staging build under
// isagog.com/isagog-web/ would be counted as production traffic: skip it.
// Client-side route changes are reported by the beacon itself (SPA-aware),
// and next/script guarantees it loads only once across navigations.
// crossOrigin matches the <link rel="preload"> Next emits to the module
// script's CORS mode; without it the browser downloads the beacon twice.
const CF_BEACON_TOKEN = "c1590541ed7d43338e6c1f6c3e6fd691";

export const CloudflareAnalytics = () =>
  IS_STAGING ? null : (
    <Script
      type="module"
      crossOrigin="anonymous"
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify({ token: CF_BEACON_TOKEN })}
      strategy="afterInteractive"
    />
  );
