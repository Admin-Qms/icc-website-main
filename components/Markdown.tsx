import Image from "next/image";
import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { isValidElement, type ReactNode } from "react";
import { createHeadingIds } from "@/lib/blog";

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children);
  return "";
}

// Ids are issued per render, in document order, so they match getHeadings().
function buildComponents(): Components {
  const nextId = createHeadingIds();

  return {
    h2: ({ children }) => (
      <h2
        id={nextId(textOf(children))}
        className="mt-12 scroll-mt-28 font-heading text-2xl font-bold leading-snug text-navy-900 sm:text-[1.7rem]"
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        id={nextId(textOf(children))}
        className="mt-8 scroll-mt-28 font-heading text-xl font-bold leading-snug text-navy-900"
      >
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-6 font-heading text-lg font-semibold text-navy-900">{children}</h4>
    ),
    // An image is a block here; don't nest its <figure> inside a <p>.
    p: ({ node, children }) => {
      const only = node?.children.length === 1 ? node.children[0] : null;
      if (only && only.type === "element" && only.tagName === "img") return <>{children}</>;
      return <p className="mt-5 leading-8">{children}</p>;
    },
    a: ({ href = "", children }) => {
      const className =
        "font-medium text-teal-700 underline decoration-teal-300 underline-offset-4 transition-colors hover:text-teal-800 hover:decoration-teal-600";
      if (href.startsWith("/") || href.startsWith("#")) {
        return (
          <Link href={href} className={className}>
            {children}
          </Link>
        );
      }
      return (
        <a href={href} className={className} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    },
    img: ({ src, alt }) =>
      typeof src === "string" ? (
        <figure className="my-10">
          <Image
            src={src}
            alt={alt ?? ""}
            width={1200}
            height={675}
            className="w-full rounded-xl border border-slate-200 shadow-sm"
          />
        </figure>
      ) : null,
    ul: ({ children }) => (
      <ul className="mt-5 list-disc space-y-2 pl-6 leading-8 marker:text-teal-600">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="mt-5 list-decimal space-y-2 pl-6 leading-8 marker:font-semibold marker:text-teal-700">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="pl-1 [&>p]:mt-0 [&>ul]:mt-2 [&>ol]:mt-2">{children}</li>,
    strong: ({ children }) => <strong className="font-semibold text-navy-900">{children}</strong>,
    // Writers use blockquotes for callouts (Key Takeaways, Important).
    blockquote: ({ children }) => (
      <blockquote className="my-8 rounded-r-xl border-l-4 border-teal-600 bg-teal-50/60 px-4 py-5 text-slate-700 sm:px-6 [&>*:first-child]:mt-0">
        {children}
      </blockquote>
    ),
    table: ({ children }) => (
      <div className="my-8 overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full min-w-[32rem] border-collapse text-left text-[15px]">{children}</table>
      </div>
    ),
    thead: ({ children }) => <thead className="bg-navy-50">{children}</thead>,
    th: ({ children }) => (
      <th className="px-4 py-3 font-heading text-sm font-bold text-navy-900">{children}</th>
    ),
    td: ({ children }) => (
      <td className="border-t border-slate-200 px-4 py-3 align-top leading-7">{children}</td>
    ),
    hr: () => <hr className="my-10 border-slate-200" />,
    code: ({ children }) => (
      <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[0.9em] text-navy-900">{children}</code>
    ),
  };
}

/** Renders a post body. Raw HTML in the source is escaped, not executed. */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="text-[17px] text-slate-700 [&>*:first-child]:mt-0">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={buildComponents()}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
