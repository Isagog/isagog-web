"use client";

import { useState } from "react";
import { ArrowUpRight, Landmark, Newspaper, Stethoscope } from "lucide-react";
import { LocaleLink } from "@/app/_components/custom/locale-link";
import { useScopedI18n } from "@/packages/locales/client";
import type { TabId } from "@/lib/knowledge-demo/types";
import { museoDisclosureKey, museoQuestions, museoTabLabelKey } from "@/lib/knowledge-demo/data/museo";
import { giornaleDisclosureKey, giornaleQuestions, giornaleTabLabelKey } from "@/lib/knowledge-demo/data/giornale";
import { clinicaDisclosureKey, clinicaQuestions, clinicaTabLabelKey } from "@/lib/knowledge-demo/data/clinica";
import { tr } from "./i18n";
import { TabStrip, type TabDef } from "./tab-strip";
import { QuestionPicker } from "./question-picker";
import { MuseoPanel } from "./museo-panel";
import { GiornalePanel } from "./giornale-panel";
import { ClinicaPanel } from "./clinica-panel";

const TAB_ICONS: Record<TabId, typeof Landmark> = {
  museo: Landmark,
  giornale: Newspaper,
  clinica: Stethoscope,
};

/**
 * Replaces the homepage's invented "MUSEO AURORA" card. Three tabs, each
 * proving one claim the page makes — MUSEO (inference), GIORNALE
 * (provenance), CLINICA (refusal) — from Isagog's real client ontologies.
 * See docs/superpowers/specs/2026-09-09-knowledge-demo-design.md.
 *
 * The default tab ("museo") and its default question are the component's
 * initial state, so a visitor without JS still sees a complete example —
 * static export prerenders this "use client" component's first render, the
 * same as every other page in this build.
 */
export const KnowledgeDemo = () => {
  const t = useScopedI18n("home");
  const [activeTab, setActiveTab] = useState<TabId>("museo");
  const [museoQuestionId, setMuseoQuestionId] = useState(museoQuestions[0]?.id ?? "");
  const [giornaleQuestionId, setGiornaleQuestionId] = useState(giornaleQuestions[0]?.id ?? "");
  const [clinicaQuestionId, setClinicaQuestionId] = useState(clinicaQuestions[0]?.id ?? "");

  const tabs: readonly TabDef[] = [
    { id: "museo", label: tr(t, museoTabLabelKey) },
    { id: "giornale", label: tr(t, giornaleTabLabelKey) },
    { id: "clinica", label: tr(t, clinicaTabLabelKey) },
  ];

  const Icon = TAB_ICONS[activeTab];

  return (
    <div className="rounded-[8px] bg-tecnologia p-6 sm:p-8">
      <div className="flex items-center justify-between text-[12px] uppercase tracking-[0.1em] text-forest">
        <span className="flex items-center gap-2">
          <Icon size={18} strokeWidth={2} />
          {t("knowledgeDemo.eyebrow")}
        </span>
      </div>

      <div className="mt-5">
        <TabStrip tabs={tabs} activeTab={activeTab} onChange={setActiveTab} tablistLabel={t("knowledgeDemo.tablistLabel")} />
      </div>

      <div
        role="tabpanel"
        id="knowledge-demo-panel-museo"
        aria-labelledby="knowledge-demo-tab-museo"
        hidden={activeTab !== "museo"}
        tabIndex={0}
        className="mt-6"
      >
        <p className="text-[12.5px] leading-snug text-prose-muted">{tr(t, museoDisclosureKey)}</p>
        <div className="mt-4">
          <QuestionPicker
            options={museoQuestions.map((q) => ({ id: q.id, question: tr(t, q.questionKey) }))}
            activeId={museoQuestionId}
            onChange={setMuseoQuestionId}
            groupLabel={t("knowledgeDemo.questionPickerLabel")}
          />
        </div>
        <div className="mt-4">
          {(() => {
            const question = museoQuestions.find((q) => q.id === museoQuestionId) ?? museoQuestions[0];
            return question !== undefined ? <MuseoPanel question={question} t={t} /> : null;
          })()}
        </div>
      </div>

      <div
        role="tabpanel"
        id="knowledge-demo-panel-giornale"
        aria-labelledby="knowledge-demo-tab-giornale"
        hidden={activeTab !== "giornale"}
        tabIndex={0}
        className="mt-6"
      >
        <p className="text-[12.5px] leading-snug text-prose-muted">{tr(t, giornaleDisclosureKey)}</p>
        <div className="mt-4">
          <QuestionPicker
            options={giornaleQuestions.map((q) => ({ id: q.id, question: tr(t, q.questionKey) }))}
            activeId={giornaleQuestionId}
            onChange={setGiornaleQuestionId}
            groupLabel={t("knowledgeDemo.questionPickerLabel")}
          />
        </div>
        <div className="mt-4">
          {(() => {
            const question = giornaleQuestions.find((q) => q.id === giornaleQuestionId) ?? giornaleQuestions[0];
            return question !== undefined ? <GiornalePanel question={question} t={t} /> : null;
          })()}
        </div>
      </div>

      <div
        role="tabpanel"
        id="knowledge-demo-panel-clinica"
        aria-labelledby="knowledge-demo-tab-clinica"
        hidden={activeTab !== "clinica"}
        tabIndex={0}
        className="mt-6"
      >
        <p className="text-[12.5px] leading-snug text-prose-muted">{tr(t, clinicaDisclosureKey)}</p>
        <div className="mt-4">
          <QuestionPicker
            options={clinicaQuestions.map((q) => ({ id: q.id, question: tr(t, q.questionKey) }))}
            activeId={clinicaQuestionId}
            onChange={setClinicaQuestionId}
            groupLabel={t("knowledgeDemo.questionPickerLabel")}
          />
        </div>
        <div className="mt-4">
          {(() => {
            const question = clinicaQuestions.find((q) => q.id === clinicaQuestionId) ?? clinicaQuestions[0];
            return question !== undefined ? <ClinicaPanel question={question} t={t} /> : null;
          })()}
        </div>
      </div>

      <LocaleLink
        href="/approach"
        className="mt-8 flex items-center gap-4 rounded-[5px] bg-paper px-5 py-4 text-forest"
      >
        <span className="flex flex-1 flex-col">
          <strong className="text-[16px]">{t("knowledgeDemo.ctaTitle")}</strong>
          <span className="text-[14px] text-prose-muted">{t("knowledgeDemo.ctaLink")}</span>
        </span>
        <ArrowUpRight size={20} strokeWidth={2} />
      </LocaleLink>
    </div>
  );
};
