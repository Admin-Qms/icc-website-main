import type { Metadata } from "next";
import { PageHeader, CTASection } from "@/components/ui";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { FeaturedPostCard, PostCard } from "@/components/PostCard";
import { getAllPosts, serializeJsonLd } from "@/lib/blog";
import { SITE } from "@/lib/site";

const description =
  "Practical guidance on ISO 9001, IATF 16949, ISO 14001 and ISO 45001 certification for Canadian companies: costs, timelines, audits and requirements.";

export const metadata: Metadata = {
  title: "ISO Certification Blog — Practical Guidance for Canadian Companies",
  description,
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    locale: "en_CA",
    siteName: SITE.name,
    url: "/blog",
    title: "ISO Certification Blog — Practical Guidance for Canadian Companies",
    description,
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const [latest, ...rest] = posts;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${SITE.name} Blog`,
    url: `${SITE.url}/blog/`,
    description,
    publisher: { "@type": "Organization", name: SITE.legalName, url: SITE.url },
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${SITE.url}/blog/${p.slug}/`,
      datePublished: p.date,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <PageHeader
        eyebrow="Blog"
        title={
          <>
            ISO certification, <span className="text-teal-700">explained plainly</span>
          </>
        }
        intro="Costs, timelines, audit preparation and clause-by-clause requirements, written for the people who run quality on the shop floor."
      />

      <section className="bg-white py-16 lg:py-20">
        <div className="container-page">
          {latest ? (
            <>
              <Reveal>
                <FeaturedPostCard post={latest} />
              </Reveal>
              {rest.length > 0 && (
                <Stagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((p) => (
                    <StaggerItem key={p.slug}>
                      <PostCard post={p} />
                    </StaggerItem>
                  ))}
                </Stagger>
              )}
            </>
          ) : (
            <p className="text-slate-600">The first articles are on their way.</p>
          )}
        </div>
      </section>

      <CTASection />
    </>
  );
}
