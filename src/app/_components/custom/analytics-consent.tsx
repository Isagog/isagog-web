"use client";

import {
  CONSENT_CHANGED,
  CONSENT_REOPEN,
  type ConsentState,
  declinedValue,
  readConsent,
  writeConsent,
} from "@/lib/analytics-consent";
import { startNavigationAnalytics } from "@/lib/navigation-analytics";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { CloudflareAnalytics } from "./cloudflare-analytics";

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
      "Vorremmo capire come viene usato il sito: quali pagine visiti, da dove arrivi, con quale dispositivo. Lo misuriamo con PostHog (UE) e Cloudflare solo se sei d'accordo. Nessun profilo personale, nessuna pubblicità.",
    details: "Maggiori dettagli",
    data:
      "Raccogliamo i percorsi delle pagine visitate e il loro ordine, gli orari e la durata della visita, il sito di provenienza, il paese approssimativo (ricavato dall'indirizzo IP) e informazioni di base su browser e dispositivo. Cloudflare misura anche le prestazioni delle pagine.",
    limits:
      "Non registriamo il contenuto dei moduli, i singoli clic o video della visita. PostHog non crea un profilo personale e conserva un identificatore anonimo solo per questa scheda del browser. Salviamo nel browser la tua scelta per le visite successive.",
    choice:
      "Se rifiuti, il sito funziona esattamente allo stesso modo. Puoi cambiare idea in qualsiasi momento da «Preferenze privacy», in fondo a ogni pagina.",
    accept: "Accetto",
    decline: "Rifiuto",
  },
  en: {
    title: "Privacy and analytics",
    summary:
      "We'd like to understand how the site is used: which pages you visit, where you come from, which device you use. We measure this with PostHog (EU) and Cloudflare only if you agree. No personal profile, no advertising.",
    details: "More details",
    data:
      "We collect the paths of pages visited and their order, visit times and duration, the referring site, approximate country (derived from the IP address), and basic browser and device information. Cloudflare also measures page performance.",
    limits:
      "We do not record form contents, individual clicks, or session videos. PostHog does not create a personal profile and keeps an anonymous identifier only for this browser tab. We save your choice in the browser for future visits.",
    choice:
      "If you decline, the site works exactly the same. You can change your mind at any time from “Privacy preferences” at the bottom of every page.",
    accept: "Accept",
    decline: "Decline",
  },
} as const;

const buttonClass =
  "min-w-[6.5rem] rounded-md bg-forest-deep px-3 py-1.5 text-xs font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest";

export function AnalyticsConsent({ locale }: { locale: string }) {
  // Fallback for this visit only, when the browser refuses localStorage.
  const [visitChoice, setVisitChoice] = useState<ConsentState>("unset");
  const storedChoice = useSyncExternalStore(subscribeToConsent, readConsent, () => "unset" as const);
  const choice = storedChoice !== "unset" ? storedChoice : visitChoice;
  const analyticsRan = useRef(false);
  const text = locale === "en" ? copy.en : copy.it;

  useEffect(() => {
    if (choice !== "accepted") return;
    analyticsRan.current = true;
    startNavigationAnalytics();
  }, [choice]);

  useEffect(() => {
    const reopen = () => setVisitChoice("unset");
    window.addEventListener(CONSENT_REOPEN, reopen);
    return () => window.removeEventListener(CONSENT_REOPEN, reopen);
  }, []);

  const accept = () => {
    writeConsent("accepted");
    setVisitChoice("accepted");
  };

  const decline = () => {
    writeConsent(declinedValue(Date.now()));
    setVisitChoice("declined");
    // Withdrawing an earlier consent: reload so the analytics already running stop.
    if (analyticsRan.current) window.location.reload();
  };

  if (choice === "accepted") return <CloudflareAnalytics />;
  if (choice === "declined") return null;

  return (
    <div className="pointer-events-none fixed bottom-3 right-3 z-[100] w-[calc(100vw-1.5rem)] max-w-[21rem] sm:bottom-4 sm:right-4">
      <section
        aria-label={text.title}
        className="pointer-events-auto max-h-[calc(100dvh-1.5rem)] w-full overflow-y-auto rounded-lg border border-card-border bg-page p-3 shadow-2xl"
      >
        <h2 className="text-base font-medium text-forest">
          {text.title}
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-forest">{text.summary}</p>
        <details className="mt-1.5 text-xs leading-relaxed text-forest">
          <summary className="w-fit cursor-pointer font-medium underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest">
            {text.details}
          </summary>
          <div className="mt-1.5 space-y-1.5">
            <p>{text.data}</p>
            <p>{text.limits}</p>
            <p>{text.choice}</p>
          </div>
        </details>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button type="button" onClick={accept} className={buttonClass}>
            {text.accept}
          </button>
          <button type="button" onClick={decline} className={buttonClass}>
            {text.decline}
          </button>
        </div>
      </section>
    </div>
  );
}
