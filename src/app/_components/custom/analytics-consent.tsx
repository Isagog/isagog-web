"use client";

import { startNavigationAnalytics } from "@/lib/navigation-analytics";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
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
    title: "Prima di proseguire",
    intro:
      "Per capire come le persone visitano questo sito, usiamo PostHog (nell'UE) e Cloudflare Web Analytics solo se scegli di continuare.",
    data:
      "Raccogliamo i percorsi delle pagine visitate e il loro ordine, gli orari e la durata della visita, il sito di provenienza, il paese approssimativo (ricavato dall'indirizzo IP) e informazioni di base su browser e dispositivo. Cloudflare misura anche le prestazioni delle pagine.",
    limits:
      "Non registriamo il contenuto dei moduli, i singoli clic o video della visita. PostHog non crea un profilo personale e conserva un identificatore anonimo solo per questa scheda del browser. Salviamo nel browser la tua scelta per le visite successive.",
    choice: "Se non sei d'accordo, puoi lasciare il sito senza attivare queste analisi.",
    accept: "Accetto e continuo",
    leave: "Non accetto: esco dal sito",
  },
  en: {
    title: "Before you continue",
    intro:
      "To understand how people navigate this site, we use PostHog (hosted in the EU) and Cloudflare Web Analytics only if you choose to continue.",
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
  const acceptButton = useRef<HTMLButtonElement>(null);
  const text = locale === "en" ? copy.en : copy.it;

  useEffect(() => {
    const site = document.getElementById("site-content");
    if (accepted) {
      site?.removeAttribute("inert");
      startNavigationAnalytics();
      return;
    }

    site?.setAttribute("inert", "");
    acceptButton.current?.focus();
    return () => site?.removeAttribute("inert");
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-forest-deep/85 p-4 sm:p-6">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="analytics-consent-title"
        aria-describedby="analytics-consent-description"
        className="max-h-[calc(100dvh-2rem)] w-full max-w-2xl overflow-y-auto rounded-lg border border-card-border bg-page p-6 shadow-2xl sm:p-9"
      >
        <h2 id="analytics-consent-title" className="text-3xl text-forest sm:text-4xl">
          {text.title}
        </h2>
        <div
          id="analytics-consent-description"
          className="mt-5 space-y-3 text-sm leading-relaxed text-forest sm:text-base"
        >
          <p>{text.intro}</p>
          <p>{text.data}</p>
          <p>{text.limits}</p>
          <p className="font-medium">{text.choice}</p>
        </div>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button
            ref={acceptButton}
            type="button"
            onClick={accept}
            className="rounded-md bg-forest-deep px-5 py-3 font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
          >
            {text.accept}
          </button>
          <a
            href="about:blank"
            className="rounded-md border border-forest-deep px-5 py-3 font-medium text-forest focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
          >
            {text.leave}
          </a>
        </div>
      </section>
    </div>
  );
}
