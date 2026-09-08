"use client";

import { buildMailtoHref } from "@/lib/contact-mailto";
import { useScopedI18n } from "@/packages/locales/client";
import { useState } from "react";

const inputClass = "rounded-[4px] border border-card-border bg-transparent px-3 py-2.5 text-[15px]";

export const ContactForm = () => {
  const t = useScopedI18n("home.contatto");
  const [draft, setDraft] = useState({
    name: "",
    email: "",
    organisation: "",
    message: "",
  });

  const update = (field: keyof typeof draft) => (value: string) =>
    setDraft((current) => ({ ...current, [field]: value }));

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.location.href = buildMailtoHref(draft);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[5px] border border-card-border bg-paper p-7"
    >
      <h4 className="font-serif text-[24px] text-forest">{t("formTitle")}</h4>
      <p className="mt-2 text-[15px] text-prose-muted">{t("formSub")}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-[13px] text-forest">
          {t("fieldName")}
          <input
            type="text"
            required
            value={draft.name}
            onChange={(event) => update("name")(event.target.value)}
            placeholder={t("fieldNamePlaceholder")}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-2 text-[13px] text-forest">
          {t("fieldEmail")}
          <input
            type="email"
            required
            value={draft.email}
            onChange={(event) => update("email")(event.target.value)}
            placeholder={t("fieldEmailPlaceholder")}
            className={inputClass}
          />
        </label>
      </div>

      <label className="mt-4 flex flex-col gap-2 text-[13px] text-forest">
        {t("fieldOrg")}
        <input
          type="text"
          value={draft.organisation}
          onChange={(event) => update("organisation")(event.target.value)}
          placeholder={t("fieldOrgPlaceholder")}
          className={inputClass}
        />
      </label>

      <label className="mt-4 flex flex-col gap-2 text-[13px] text-forest">
        {t("fieldMessage")}
        <textarea
          required
          rows={4}
          value={draft.message}
          onChange={(event) => update("message")(event.target.value)}
          placeholder={t("fieldMessagePlaceholder")}
          className={inputClass}
        />
      </label>

      <p className="mt-3 text-[13px] text-prose-muted">{t("formNote")}</p>

      <button
        type="submit"
        className="mt-5 w-full rounded-[5px] bg-forest-deep px-5 py-3.5 text-[15px] font-medium text-white"
      >
        {t("submit")}
      </button>

      <p className="mt-4 text-[12.5px] leading-[1.5] text-num">{t("disclosure")}</p>
    </form>
  );
};
