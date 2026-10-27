import type { Metadata } from "next";
import { PageHeader, CTASection } from "@/components/ui";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { FeaturedPostCard, PostCard } from "@/components/PostCard";
import { getAllPosts, serializeJsonLd } from "@/lib/blog";
import { SITE, OG_IMAGE } from "@/lib/site";
import { pageTitle } from "@/lib/seo";

const description =
  "Practical ISO 9001, IATF 16949 and AS9100 how-tos for quality teams, plus how compliance software automates the work. Book a demo to see it.";

export const metadata: Metadata = {
  title: pageTitle("Compliance Blog: ISO 9001, IATF 16949 and AS9100 Guidance"),
  description,
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    locale: "en_CA",
    siteName: SITE.name,
    url: "/blog",
    title: "Compliance Blog: ISO 9001, IATF 16949 and AS9100 Guidance",
    description,
    images: [OG_IMAGE],
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
            Practical compliance guidance, <span className="text-teal-700">and the software that automates it</span>
          </>
        }
        intro="Standards how-tos for the people who run quality on the shop floor, and a demo of the software that automates the work."
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
