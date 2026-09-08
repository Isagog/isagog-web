import type { ReactNode } from "react";

export const CapabilityCard = ({
  number,
  title,
  body,
  result,
  icon,
}: {
  number: string;
  title: string;
  body: string;
  result: string;
  icon: ReactNode;
}) => (
  <article className="rounded-[5px] border border-card-border bg-paper p-7">
    <span className="block text-forest">{icon}</span>
    <span className="mt-4 block text-[12px] tracking-[0.1em] text-num">{number}</span>
    <h4 className="mt-3 font-serif text-[24px] text-forest">{title}</h4>
    <p className="mt-3 mb-6 text-[16px] leading-[1.5] text-prose-muted">{body}</p>
    <span className="text-[12px] text-result">{result}</span>
  </article>
);
