import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader, CTASection } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { ArrowRight, Check } from "@/components/Icons";
import { SITE } from "@/lib/site";
import { serializeJsonLd } from "@/lib/blog";
import {
  ANTHONY_MANNELLA as person,
  personJsonLd,
  personPath,
  formatDate,
} from "@/lib/people";

const description =
  "Anthony Mannella is CEO and consultant at ISO Certification Consultants Inc. and writes on ISO 9001, metrology and supplier control for Canadian Metalworking.";

export const metadata: Metadata = {
  title: `${person.name}, CEO and Consultant`,
  description,
  alternates: { canonical: personPath(person) },
  openGraph: {
    type: "profile",
    title: `${person.name}, CEO and Consultant`,
    description,
    url: personPath(person),
    images: [
      { url: person.photo, width: 800, height: 800, alt: person.photoAlt },
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfilePage",
      url: `${SITE.url}${personPath(person)}`,
      name: `${person.name}, ${person.jobTitle}`,
      mainEntity: personJsonLd(person),
    },
    ...person.publications.map((p) => ({
      "@type": "Article",
      headline: p.title,
      url: p.url,
      datePublished: p.date,
      author: { "@id": personJsonLd(person)["@id"] },
      publisher: person.publisher && {
        "@type": "Organization",
        name: person.publisher.name,
        url: person.publisher.url,
      },
    })),
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "About",
          item: `${SITE.url}/about/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: person.name,
          item: `${SITE.url}${personPath(person)}`,
        },
      ],
    },
  ],
};

export default function AnthonyMannellaPage() {
  const publisher = person.publisher!;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <PageHeader
        eyebrow="Leadership"
        title={person.name}
        intro={`${person.jobTitle} at ${SITE.legalName}, and a contributor to ${publisher.name}.`}
      >
        <Link href="/contact" className="btn-primary">
          Book a demo <ArrowRight className="h-4 w-4" />
        </Link>
      </PageHeader>

      <section className="bg-white py-16 lg:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <Reveal>
            <Image
              src={person.photo}
              alt={person.photoAlt}
              width={800}
              height={800}
              className="w-full max-w-sm rounded-2xl border border-slate-200 object-cover shadow-[0_20px_60px_-40px_rgba(22,43,77,0.5)]"
            />
          </Reveal>
          <Reveal delay={0.05}>
            <div className="space-y-4 text-[17px] leading-relaxed text-slate-700">
              <p>
                Anthony Mannella is the CEO of {SITE.legalName}, a Toronto-based
                firm that prepares Canadian companies for ISO and sector
                certification audits. He also works as a consultant on client
                engagements, alongside the compliance management software the
                company configures for each client.
              </p>
              {person.experience && (
                <p>
                  He brings {person.experience.charAt(0).toLowerCase()}
                  {person.experience.slice(1)}
                </p>
              )}
              <p>
                He writes about quality management for{" "}
                <a
                  href={publisher.url}
                  className="font-semibold text-teal-700 hover:text-teal-800"
                >
                  {publisher.name}
                </a>
                , a Canadian trade publication for metal manufacturers. His
                articles cover ISO 9001 certification, metrology and measurement
                system analysis, lean manufacturing, and the control of
                suppliers and outsourced work.
              </p>
            </div>
            {person.credentials && person.credentials.length > 0 && (
              <>
                <h2 className="mt-10 font-heading text-xl font-bold text-navy-900">
                  Credentials
                </h2>
                <ul className="mt-4 space-y-3">
                  {person.credentials.map((c) => (
                    <li key={c} className="flex items-start gap-2 text-slate-700">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-teal-600" />
                      {c}
                    </li>
                  ))}
                </ul>
              </>
            )}
            <h2 className="mt-10 font-heading text-xl font-bold text-navy-900">
              Areas of focus
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {person.topics.map((t) => (
                <li key={t} className="flex items-start gap-2 text-slate-700">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-teal-600" />
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="bg-soft py-16 lg:py-24">
        <div className="container-page max-w-4xl">
          <h2 className="font-heading text-3xl font-bold leading-tight text-navy-900">
            Published in {publisher.name}
          </h2>
          <p className="mt-3 text-slate-600">
            Articles by Anthony Mannella, newest first.{" "}
            <a
              href={person.profiles[0]}
              className="font-semibold text-teal-700 hover:text-teal-800"
            >
              See his author page
            </a>
            .
          </p>
          <ol className="mt-10 space-y-5">
            {person.publications.map((p) => (
              <li
                key={p.url}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(22,43,77,0.5)]"
              >
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-teal-700">
                  <time dateTime={p.date}>{formatDate(p.date)}</time>
                </p>
                <h3 className="mt-2 font-heading text-lg font-bold text-navy-900">
                  <a href={p.url} className="hover:text-teal-700">
                    {p.title}
                  </a>
                </h3>
                <p className="mt-2 text-slate-600">{p.summary}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CTASection />
    </>
  );
}
