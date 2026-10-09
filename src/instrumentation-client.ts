import posthog from "posthog-js";

import { IS_STAGING } from "@/lib/base-path";

// The project token is public by design: PostHog includes it in browser SDKs.
// Keep previews and local development out of the production navigation paths.
const POSTHOG_PROJECT_TOKEN = "phc_zAQW9JJwLQQKoprXuoCCzY3GXataEc68SxecAfyhU7qb";

if (
  process.env.NODE_ENV === "production" &&
  !IS_STAGING &&
  ["isagog.com", "www.isagog.com"].includes(window.location.hostname)
) {
  posthog.init(POSTHOG_PROJECT_TOKEN, {
    api_host: "https://eu.i.posthog.com",
    defaults: "2026-05-30",
    // Captures the initial page and completed pathname changes in the App Router.
    capture_pageview: "history_change",
    capture_pageleave: true,
    // Navigation analysis needs neither form/click capture nor recordings.
    autocapture: false,
    rageclick: false,
    disable_session_recording: true,
    disable_surveys: true,
    person_profiles: "never",
    // Retain an anonymous ID during this SPA visit without browser storage.
    persistence: "memory",
  });
}
