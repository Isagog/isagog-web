/**
 * The visitor's analytics choice, kept in localStorage. "accepted" lasts
 * until the visitor changes it from the footer; a refusal is stored with
 * its timestamp and expires after about six months, so the banner is not
 * shown again before then (Garante privacy, cookie guidelines, 10 June 2021).
 */
export const CONSENT_KEY = "isagog-analytics-consent-v1";
/** Fired on this tab whenever the stored choice changes. */
export const CONSENT_CHANGED = "isagog-analytics-consent-changed";
/** Fired by the footer link to show the banner again. */
export const CONSENT_REOPEN = "isagog-analytics-consent-reopen";

export const DECLINE_MAX_AGE_MS = 182 * 24 * 60 * 60 * 1000;

export type ConsentState = "accepted" | "declined" | "unset";

const DECLINED_PREFIX = "declined:";

export const declinedValue = (now: number): string => `${DECLINED_PREFIX}${now}`;

export function parseConsent(raw: string | null, now: number): ConsentState {
  if (raw === "accepted") return "accepted";
  if (raw?.startsWith(DECLINED_PREFIX)) {
    const declinedAt = Number(raw.slice(DECLINED_PREFIX.length));
    const age = now - declinedAt;
    if (Number.isFinite(declinedAt) && age >= 0 && age < DECLINE_MAX_AGE_MS) return "declined";
  }
  return "unset";
}

export function readConsent(): ConsentState {
  try {
    return parseConsent(window.localStorage.getItem(CONSENT_KEY), Date.now());
  } catch {
    return "unset";
  }
}

/** Stores the choice (null clears it). Returns false when storage is unavailable. */
export function writeConsent(value: string | null): boolean {
  let stored = true;
  try {
    if (value === null) window.localStorage.removeItem(CONSENT_KEY);
    else window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    stored = false;
  }
  window.dispatchEvent(new Event(CONSENT_CHANGED));
  return stored;
}

export function reopenConsent() {
  writeConsent(null);
  window.dispatchEvent(new Event(CONSENT_REOPEN));
}
