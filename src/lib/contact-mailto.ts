export interface ContactDraft {
  readonly name: string;
  readonly email: string;
  readonly organisation: string;
  readonly message: string;
}

const SUBJECT = "Isagog — richiesta di confronto";

/**
 * Build the mailto: link the contact form opens. The form sends nothing
 * itself — a static site has no backend — so the user reviews and sends
 * the draft from their own mail client.
 */
export const buildMailtoHref = (draft: ContactDraft, to = "info@isagog.com"): string => {
  const fields: ReadonlyArray<readonly [string, string]> = [
    ["Nome", draft.name],
    ["Email", draft.email],
    ["Organizzazione", draft.organisation],
  ];

  const header = fields
    .filter(([, value]) => value.trim() !== "")
    .map(([label, value]) => `${label}: ${value.trim()}`);

  const message = draft.message.trim();
  const body = message === "" ? header : [...header, "", message];

  // encodeURIComponent, not URLSearchParams: the latter encodes spaces as "+",
  // which mail clients show literally in the message body.
  const subject = encodeURIComponent(SUBJECT);
  return `mailto:${to}?subject=${subject}&body=${encodeURIComponent(body.join("\n"))}`;
};
