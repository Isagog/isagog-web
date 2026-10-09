import posthog from "posthog-js";

import { IS_STAGING } from "@/lib/base-path";

// This browser token is public by design; it cannot read the project's data.
const POSTHOG_PROJECT_TOKEN = "phc_zAQW9JJwLQQKoprXuoCCzY3GXataEc68SxecAfyhU7qb";

let started = false;

export function startNavigationAnalytics() {
  if (
    started ||
    process.env.NODE_ENV !== "production" ||
    IS_STAGING ||
    !["isagog.com", "www.isagog.com"].includes(window.location.hostname)
  ) {
    return;
  }

  posthog.init(POSTHOG_PROJECT_TOKEN, {
    api_host: "https://eu.i.posthog.com",
    defaults: "2026-05-30",
    capture_pageview: "history_change",
    capture_pageleave: true,
    autocapture: false,
    rageclick: false,
    disable_session_recording: true,
    disable_surveys: true,
    disable_capture_url_hashes: true,
    save_campaign_params: false,
    person_profiles: "never",
    // Keep one anonymous visit across full-page locale changes, then clear it
    // when the browser tab closes. No PostHog cookie or long-lived local ID.
    persistence: "sessionStorage",
    before_send: (event) => {
      if (!event || (event.event !== "$pageview" && event.event !== "$pageleave")) return null;

      // Navigation paths need page paths, not query strings that could contain
      // information entered elsewhere and passed along in a link.
      for (const key of [
        "$current_url",
        "$initial_current_url",
        "$session_entry_url",
        "$referrer",
        "$initial_referrer",
      ]) {
        const value = event.properties?.[key];
        if (typeof value !== "string") continue;
        try {
          const url = new URL(value);
          event.properties[key] = `${url.origin}${url.pathname}`;
        } catch {
          // Non-URL referrer values (for example, "$direct") stay as-is.
        }
      }
      return event;
    },
  });

  started = true;
}
