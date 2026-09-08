import { asset } from "@/lib/base-path";
import MarkdownToJSX from "markdown-to-jsx";
import Image from "next/image";

interface MarkdownRendererProps {
  content: string;
  imageClassName?: string;
}

export const MarkdownRenderer = ({ content, imageClassName = "" }: MarkdownRendererProps) => {
  return (
    <MarkdownToJSX
      options={{
        enforceAtxHeadings: true,
        overrides: {
          h1: {
            props: { className: "font-serif text-4xl mt-8 mb-4 text-center text-forest" },
          },
          h2: { props: { className: "font-serif text-3xl mt-6 mb-3 text-forest" } },
          h3: { props: { className: "font-serif text-2xl mt-6 mb-2 text-forest" } },
          h4: { props: { className: "font-serif text-xl mt-4 mb-2 text-forest" } },
          h5: { props: { className: "font-serif text-lg mt-3 mb-1 text-forest" } },
          h6: { props: { className: "font-serif text-base mt-2 mb-1 text-forest" } },
          p: { props: { className: "text-[16.5px] leading-[1.6] mb-4 text-prose-muted" } },
          a: { props: { className: "text-terracotta hover:underline" } },
          ul: { props: { className: "list-disc list-inside mb-4 text-[16.5px] leading-[1.6] text-prose-muted" } },
          ol: { props: { className: "list-decimal list-inside mb-4 text-[16.5px] leading-[1.6] text-prose-muted" } },
          li: { props: { className: "mb-1" } },
          blockquote: {
            props: {
              className: "border-l-4 border-divider pl-4 italic text-muted-ink mb-4",
            },
          },
          img: {
            component: ({ src }: { src?: string }) => (
              <Image
                src={asset(src ?? "")}
                className={`${imageClassName} block mx-auto my-6 w-auto h-auto`}
                alt="article-image"
                width={500}
                height={500}
              />
            ),
          },
          code: {
            props: {
              className: "bg-tecnologia text-sm px-1 py-0.5 rounded font-mono",
            },
          },
          pre: {
            props: {
              className: "bg-forest text-cream text-sm p-4 rounded-lg overflow-x-auto mb-4",
            },
          },
          table: {
            props: {
              className: "table-auto border-collapse w-full my-6",
            },
          },
          thead: {
            props: {
              className: "bg-tecnologia",
            },
          },
          th: {
            props: {
              className: "border border-card-border px-4 py-2 text-left font-semibold text-forest",
            },
          },
          td: {
            props: {
              className: "border border-card-border px-4 py-2 text-prose-muted",
            },
          },
          strong: {
            props: {
              className: "font-bold text-forest",
            },
          },
          em: {
            props: {
              className: "italic text-prose-muted",
            },
          },
        },
      }}
    >
      {content}
    </MarkdownToJSX>
  );
};
