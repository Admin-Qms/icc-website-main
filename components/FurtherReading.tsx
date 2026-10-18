import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "./Icons";
import { publicationsFor, personPath, formatDate } from "@/lib/people";

/**
 * "Further reading": articles our people have published elsewhere
 * that fit this page (mapped by `featuredOn` in lib/people.ts). Renders nothing when
 * no article is mapped to the page.
 */
export function FurtherReading({ path }: { path: string }) {
  const items = publicationsFor(path);
  if (items.length === 0) return null;
  const { person } = items[0];
  const publisher = person.publisher?.name ?? "trade press";

  return (
    <section className="border-t border-slate-200 bg-white py-16">
      <div className="container-page">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <Image
            src={person.photo}
            alt={person.photoAlt}
            width={72}
            height={72}
            className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-teal-100"
          />
          <div>
            <h2 className="font-heading text-2xl font-bold text-navy-900">
              Further reading
            </h2>
            <p className="mt-1 text-slate-600">
              <Link
                href={personPath(person)}
                className="font-semibold text-teal-700 hover:text-teal-800"
              >
                {person.name}
              </Link>{" "}
              writes about quality management for {publisher}.
            </p>
          </div>
        </div>
        <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map(({ publication: p }) => (
            <li key={p.url}>
              <a
                href={p.url}
                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(22,43,77,0.5)] transition hover:border-teal-300"
              >
                <span className="text-xs font-bold uppercase tracking-[0.12em] text-teal-700">
                  {publisher} ·{" "}
                  <time dateTime={p.date}>{formatDate(p.date)}</time>
                </span>
                <span className="mt-2 font-heading text-lg font-bold text-navy-900 group-hover:text-teal-700">
                  {p.title}
                </span>
                <span className="mt-2 flex-1 text-sm text-slate-600">
                  {p.summary}
                </span>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700">
                  Read the article <ArrowRight className="h-4 w-4" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
