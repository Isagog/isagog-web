export interface ContactDraft {
  readonly name: string;
  readonly email: string;
  readonly organisation: string;
  readonly message: string;
}

/** Subject and body labels of the drafted email, in the page's language. */
export interface MailtoCopy {
  readonly subject: string;
  readonly name: string;
  readonly email: string;
  readonly organisation: string;
}

// Mirrors contact.contatto.mail* in it.ts; the form passes the active locale's copy.
const DEFAULT_COPY: MailtoCopy = {
  subject: "Isagog — richiesta di confronto",
  name: "Nome",
  email: "Email",
  organisation: "Organizzazione",
};

/**
 * Build the mailto: link the contact form opens. The form sends nothing
 * itself — a static site has no backend — so the user reviews and sends
 * the draft from their own mail client.
 */
export const buildMailtoHref = (
  draft: ContactDraft,
  to = "info@isagog.com",
  copy: MailtoCopy = DEFAULT_COPY
): string => {
  const fields: ReadonlyArray<readonly [string, string]> = [
    [copy.name, draft.name],
    [copy.email, draft.email],
    [copy.organisation, draft.organisation],
  ];

  const header = fields
    .filter(([, value]) => value.trim() !== "")
    .map(([label, value]) => `${label}: ${value.trim()}`);

  const message = draft.message.trim();
  const body = message === "" ? header : [...header, "", message];

  // encodeURIComponent, not URLSearchParams: the latter encodes spaces as "+",
  // which mail clients show literally in the message body.
  const subject = encodeURIComponent(copy.subject);
  return `mailto:${to}?subject=${subject}&body=${encodeURIComponent(body.join("\n"))}`;
};
