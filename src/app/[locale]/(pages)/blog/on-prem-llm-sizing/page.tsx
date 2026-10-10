import { LocaleLink as Link } from "@/app/_components/custom/locale-link";
import { SIZING_COPY, type SizingCopy } from "@/lib/llm-sizing/copy";
import { localizeHardware, localizeModels } from "@/lib/llm-sizing/format";
import { defaultLocale, locales, type Locale } from "@/lib/locale-href";
import { buildPageMetadata } from "@/lib/page-metadata";
import { getScopedI18n, setStaticParamsLocale } from "@/packages/locales/server";
import type { Metadata } from "next";
import { CalibrationTable } from "./_components/calibration-table";
import { RichText } from "./_components/rich-text";
import { SizingTool } from "./_components/sizing-tool";

const PATH = "/blog/on-prem-llm-sizing";
const SECTION_HEADING = "text-[clamp(22px,2.4vw,28px)] leading-[1.2] text-terracotta";
const CODE_CLASS = "rounded-[3px] bg-cream px-1.5 py-px font-mono text-[13px] font-medium text-forest";
const LINK_CLASS = "text-forest underline underline-offset-[3px] hover:text-sage";

const toLocale = (locale: string): Locale => locales.find((l) => l === locale) ?? defaultLocale;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setStaticParamsLocale(locale);
  const t = await getScopedI18n("meta");
  return buildPageMetadata({
    locale,
    path: PATH,
    title: t("llmSizing.title"),
    description: t("llmSizing.description"),
  });
}

const PageHeader = ({ copy }: { copy: SizingCopy }) => (
  <header className="grid items-end gap-x-10 gap-y-3.5 border-b border-card-border pb-7 min-[760px]:grid-cols-[minmax(0,1fr)_auto]">
    <div>
      <p className="mb-3.5 flex items-center gap-2 text-[12px] font-semibold uppercase leading-none tracking-[0.1em] text-prose-muted">
        <span aria-hidden="true" className="h-[7px] w-[7px] rounded-full bg-terracotta" />
        {copy.eyebrow}
      </p>
      <h1 className="text-[clamp(32px,4.6vw,48px)] leading-[1.08] text-forest">{copy.title}</h1>
      <p className="mt-4 max-w-[70ch] text-[17px] leading-[1.6] text-muted-ink [&_b]:font-semibold [&_b]:text-forest">
        <RichText text={copy.lede} />
      </p>
    </div>
    <p className="rounded-[5px] border border-card-border bg-paper px-4 py-3 text-[13px] font-medium leading-[1.6] text-prose-muted min-[760px]:whitespace-nowrap min-[760px]:text-right">
      <strong className="block font-serif text-[20px] font-normal leading-[1.2] tracking-[-0.02em] text-forest">
        {copy.stamp.month}
      </strong>
      {copy.stamp.lines.map((line, i) => (
        <span key={line}>
          {i > 0 && <br />}
          {line}
        </span>
      ))}
    </p>
  </header>
);

const Method = ({ copy }: { copy: SizingCopy["method"] }) => (
  <section className="flex flex-col gap-3.5">
    <h2 className={SECTION_HEADING}>{copy.heading}</h2>
    <div className="grid gap-x-9 gap-y-[22px] [grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr))]">
      {copy.items.map((item) => (
        <div key={item.title} className="min-w-0">
          <h3 className="mb-1.5 text-[19px] leading-[1.3] tracking-[-0.02em] text-forest">{item.title}</h3>
          <p className="max-w-[62ch] text-[15px] leading-[1.6] text-muted-ink">
            <RichText text={item.body} codeClassName={CODE_CLASS} />
          </p>
        </div>
      ))}
    </div>
  </section>
);

const Sources = ({ copy }: { copy: SizingCopy["sources"] }) => (
  <section className="flex flex-col gap-3.5">
    <h2 className={SECTION_HEADING}>{copy.heading}</h2>
    <div className="grid gap-x-9 gap-y-4 text-[14px] [grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))]">
      {copy.groups.map((group) => (
        <div key={group.title}>
          <h3 className="mb-2.5 font-sans text-[12px] font-semibold uppercase leading-none tracking-[0.1em] text-prose-muted">
            {group.title}
          </h3>
          <ul className="flex list-disc flex-col gap-1.5 pl-[18px] text-muted-ink">
            {group.items.map((item) => (
              <li key={typeof item === "string" ? item : item[0]?.href}>
                {typeof item === "string"
                  ? item
                  : item.map((link, i) => (
                      <span key={link.href}>
                        {i > 0 && ", "}
                        <a href={link.href} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
                          {link.label}
                        </a>
                      </span>
                    ))}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </section>
);

const ContactBand = ({ copy }: { copy: SizingCopy["cta"] }) => (
  <aside className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 rounded-[5px] bg-forest px-[clamp(20px,3vw,36px)] py-7 text-cream">
    <div>
      <h2 className="text-[clamp(22px,2.4vw,28px)] leading-[1.2] tracking-[-0.025em] text-cream">{copy.title}</h2>
      <p className="mt-2 max-w-[60ch] text-[15px] leading-[1.6] text-cream-soft">{copy.body}</p>
    </div>
    <Link
      href="/contact"
      className="whitespace-nowrap rounded-[5px] bg-em-dark px-[22px] py-3.5 text-[15px] font-medium leading-none text-forest hover:bg-white"
    >
      {copy.link}
    </Link>
  </aside>
);

const LlmSizingPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale: rawLocale } = await params;
  setStaticParamsLocale(rawLocale);
  const locale = toLocale(rawLocale);
  const t = await getScopedI18n("blog");
  const copy = SIZING_COPY[locale];
  const models = localizeModels(locale);
  const hardware = localizeHardware(locale, copy.tool.onQuote);

  return (
    <main className="mx-auto flex max-w-[1224px] flex-col gap-9 px-6 pb-16 pt-12">
      <PageHeader copy={copy} />
      <SizingTool locale={locale} copy={copy} models={models} hardware={hardware} />
      <section className="flex flex-col gap-3.5">
        <h2 className={SECTION_HEADING}>{copy.calibration.heading}</h2>
        <p className="max-w-[74ch] text-muted-ink">{copy.calibration.intro}</p>
        <CalibrationTable t={copy.tool} locale={locale} hardware={hardware} />
      </section>
      <Method copy={copy.method} />
      <Sources copy={copy.sources} />
      <p className="border-t border-card-border pt-4 text-[13px] text-prose-muted">{copy.footnote}</p>
      <ContactBand copy={copy.cta} />
      <Link href="/blog" className="self-start text-[15px] font-semibold text-terracotta">
        ← {t("backToBlog")}
      </Link>
    </main>
  );
};

export default LlmSizingPage;
