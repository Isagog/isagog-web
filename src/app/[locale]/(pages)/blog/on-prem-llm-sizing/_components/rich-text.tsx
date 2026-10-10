import type { ReactNode } from "react";

const SPAN = /(<b>.*?<\/b>|<code>.*?<\/code>)/;
const TAG = /^<(b|code)>(.*)<\/\1>$/;

/**
 * Renders the sizing copy's inline markup: <b> and <code> spans only, no
 * nesting. The copy is a trusted constant, but nothing is injected as HTML —
 * unknown markup stays visible as text.
 */
export const RichText = ({ text, codeClassName }: { text: string; codeClassName?: string }): ReactNode =>
  text.split(SPAN).map((part, i) => {
    const match = part.match(TAG);
    if (!match) return part;
    const [, tag, inner] = match;
    return tag === "b" ? (
      <b key={i}>{inner}</b>
    ) : (
      <code key={i} className={codeClassName}>
        {inner}
      </code>
    );
  });
