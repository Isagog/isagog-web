"use client";

import { startNavigationAnalytics } from "@/lib/navigation-analytics";
import { useEffect, useState, useSyncExternalStore } from "react";
import { CloudflareAnalytics } from "./cloudflare-analytics";

const CONSENT_KEY = "isagog-analytics-consent-v1";
const CONSENT_CHANGED = "isagog-analytics-consent-changed";

function consentSnapshot() {
  try {
    return window.localStorage.getItem(CONSENT_KEY) === "accepted";
  } catch {
    return false;
  }
}

function subscribeToConsent(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CONSENT_CHANGED, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CONSENT_CHANGED, callback);
  };
}

const copy = {
  it: {
    title: "Privacy e analisi",
    summary:
      "Solo con il tuo consenso, PostHog (UE) e Cloudflare misurano pagine visitate e ordine, durata, provenienza, paese approssimativo, browser, dispositivo e prestazioni.",
    details: "Maggiori dettagli",
    data:
      "Raccogliamo i percorsi delle pagine visitate e il loro ordine, gli orari e la durata della visita, il sito di provenienza, il paese approssimativo (ricavato dall'indirizzo IP) e informazioni di base su browser e dispositivo. Cloudflare misura anche le prestazioni delle pagine.",
    limits:
      "Non registriamo il contenuto dei moduli, i singoli clic o video della visita. PostHog non crea un profilo personale e conserva un identificatore anonimo solo per questa scheda del browser. Salviamo nel browser la tua scelta per le visite successive.",
    choice: "Se non sei d'accordo, puoi lasciare il sito senza attivare queste analisi.",
    accept: "Accetto e continuo",
    leave: "Non accetto: esco dal sito",
  },
  en: {
    title: "Privacy and analytics",
    summary:
      "Only with your consent, PostHog (EU) and Cloudflare measure pages visited and their order, visit duration, referral, approximate country, browser, device, and performance.",
    details: "More details",
    data:
      "We collect the paths of pages visited and their order, visit times and duration, the referring site, approximate country (derived from the IP address), and basic browser and device information. Cloudflare also measures page performance.",
    limits:
      "We do not record form contents, individual clicks, or session videos. PostHog does not create a personal profile and keeps an anonymous identifier only for this browser tab. We save your choice in the browser for future visits.",
    choice: "If you disagree, you can leave the site without activating this analytics.",
    accept: "Agree and continue",
    leave: "Disagree and leave site",
  },
} as const;

export function AnalyticsConsent({ locale }: { locale: string }) {
  const [acceptedForVisit, setAcceptedForVisit] = useState(false);
  const storedConsent = useSyncExternalStore(subscribeToConsent, consentSnapshot, () => false);
  const accepted = storedConsent || acceptedForVisit;
  const text = locale === "en" ? copy.en : copy.it;

  useEffect(() => {
    if (accepted) startNavigationAnalytics();
  }, [accepted]);

  const accept = () => {
    try {
      window.localStorage.setItem(CONSENT_KEY, "accepted");
      window.dispatchEvent(new Event(CONSENT_CHANGED));
    } catch {
      // Consent still applies to this visit if storage is unavailable.
    }
    setAcceptedForVisit(true);
  };

  if (accepted) return <CloudflareAnalytics />;

  return (
    <div className="pointer-events-none fixed inset-x-3 bottom-3 z-[100] sm:inset-x-6 sm:bottom-6">
      <section
        aria-label={text.title}
        className="pointer-events-auto mx-auto max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl overflow-y-auto rounded-lg border border-card-border bg-page p-4 shadow-2xl sm:p-5"
      >
        <h2 className="text-lg font-medium text-forest sm:text-xl">
          {text.title}
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-forest">{text.summary}</p>
        <details className="mt-2 text-sm leading-relaxed text-forest">
          <summary className="w-fit cursor-pointer font-medium underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest">
            {text.details}
          </summary>
          <div className="mt-2 space-y-2">
            <p>{text.data}</p>
            <p>{text.limits}</p>
            <p>{text.choice}</p>
          </div>
        </details>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          <button
            type="button"
            onClick={accept}
            className="rounded-md bg-forest-deep px-4 py-2 text-sm font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
          >
            {text.accept}
          </button>
          <a
            href="about:blank"
            className="text-sm font-medium text-forest underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
          >
            {text.leave}
          </a>
        </div>
      </section>
    </div>
  );
}
