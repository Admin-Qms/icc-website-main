import { Markdown } from "./Markdown";
import { FaqAccordion } from "./FaqAccordion";
import { PostCard } from "./PostCard";
import { Reveal } from "./motion";
import { Check } from "./Icons";
import { faqPlainText, serializeJsonLd, type Post } from "@/lib/blog";
import type { PageCopy } from "@/lib/page-copy";

/**
 * Long-form copy for the service and industry pages (lib/page-copy/*). The
 * overview sits under the page header; the sections, FAQ and related articles
 * follow the page's cards. The FAQ is also emitted as FAQPage structured data.
 */
export function CopyOverview({ copy }: { copy: PageCopy }) {
  return (
    <section className="bg-white pt-14 lg:pt-20">
      <div className="container-page max-w-3xl [&_p]:text-[17px] [&_p]:leading-relaxed">
        <Markdown>{copy.overview.join("\n\n")}</Markdown>
      </div>
    </section>
  );
}

export function CopyArticle({
  copy,
  topic,
  posts,
}: {
  copy: PageCopy;
  /** Short name used in headings, e.g. "ISO 9001" or "automotive". */
  topic: string;
  posts: Post[];
}) {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: copy.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: faqPlainText(f.answer) },
    })),
  };

  return (
    <section className="bg-white py-16 lg:py-20">
      {copy.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqJsonLd) }}
        />
      )}
      <div className="container-page max-w-3xl">
        {copy.sections.map((section) => (
          <Reveal key={section.heading}>
            <Markdown>{`## ${section.heading}\n\n${section.paragraphs.join("\n\n")}`}</Markdown>
            {section.points && section.points.length > 0 && (
              <ul className="mb-12 mt-6 space-y-3">
                {section.points.map((p) => (
                  <li
                    key={p.title}
                    className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <div className="text-slate-600 [&_p]:m-0 [&_p]:text-[15px] [&_p]:leading-relaxed">
                      <h3 className="font-heading text-[15px] font-semibold text-navy-900">
                        {p.title}
                      </h3>
                      <Markdown>{p.detail}</Markdown>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Reveal>
        ))}

        <FaqAccordion
          heading={{ text: `${topic} questions, answered`, id: "faq" }}
          items={copy.faqs}
        />
      </div>

      {posts.length > 0 && (
        <div className="container-page mt-16">
          <h2 className="font-heading text-xl font-bold text-navy-900">
            Articles on {topic}
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
