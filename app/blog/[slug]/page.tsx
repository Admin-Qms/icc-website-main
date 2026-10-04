import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader, CTASection } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { ArrowRight } from "@/components/Icons";
import { Markdown } from "@/components/Markdown";
import { PostCard } from "@/components/PostCard";
import {
  formatDate,
  getAllPosts,
  getHeadings,
  getPost,
  getRelatedPosts,
  serializeJsonLd,
} from "@/lib/blog";
import { SITE } from "@/lib/site";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug);
  if (!post) return {};
  const url = `/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: url },
    // A child openGraph replaces the layout's, so site-level fields are restated.
    openGraph: {
      type: "article",
      locale: "en_CA",
      siteName: SITE.name,
      url,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      authors: [post.author],
      images: [
        { url: post.image.src, width: post.image.width, height: post.image.height, alt: post.image.alt },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.image.src],
    },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const toc = getHeadings(post.body).filter((h) => h.depth === 2);
  const related = getRelatedPosts(post);
  const url = `${SITE.url}/blog/${post.slug}/`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description,
        image: `${SITE.url}${post.image.src}`,
        datePublished: post.date,
        dateModified: post.updated ?? post.date,
        author: { "@type": "Organization", name: post.author, url: SITE.url },
        publisher: { "@type": "Organization", name: SITE.legalName, url: SITE.url },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        articleSection: post.category,
        keywords: post.keywords.join(", "),
        wordCount: post.wordCount,
        inLanguage: "en-CA",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE.url}/` },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE.url}/blog/` },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <PageHeader eyebrow={post.category} title={post.title} intro={post.description}>
        <p className="text-sm text-slate-600">
          <span className="font-semibold text-navy-900">{post.author}</span>
          <span className="mx-2 text-slate-300">·</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span className="mx-2 text-slate-300">·</span>
          {post.readTime} min read
        </p>
      </PageHeader>

      <section className="bg-white py-12 lg:py-16">
        <div className="container-page grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px]">
          <article className="min-w-0 max-w-3xl">
            <figure>
              <Image
                src={post.image.src}
                alt={post.image.alt}
                width={post.image.width}
                height={post.image.height}
                priority
                className="w-full rounded-xl border border-slate-200 shadow-sm"
              />
              {post.image.credit && (
                <figcaption className="mt-2 text-xs text-slate-500">Photo: {post.image.credit}</figcaption>
              )}
            </figure>

            <div className="mt-10">
              <Markdown>{post.body}</Markdown>
            </div>

            <div className="mt-12 border-t border-slate-200 pt-6">
              <Link href="/blog" className="link-arrow">
                <ArrowRight className="h-4 w-4 rotate-180" />
                All articles
              </Link>
            </div>
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-6">
              {toc.length > 1 && (
                <nav aria-label="On this page" className="card p-6">
                  <h2 className="font-heading text-sm font-bold uppercase tracking-wide text-slate-700">
                    On this page
                  </h2>
                  <ul className="mt-3 space-y-2.5 text-sm">
                    {toc.map((h) => (
                      <li key={h.id}>
                        <a href={`#${h.id}`} className="leading-snug text-slate-600 hover:text-teal-700">
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
              <div className="card p-6">
                <h2 className="font-heading text-lg font-bold text-navy-900">
                  Not sure where your system stands?
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  The free readiness assessment scores your operation against the standard in a few
                  minutes.
                </p>
                <Link href="/assessment" className="btn-primary mt-5 w-full">
                  Take the assessment
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-soft py-16">
          <div className="container-page">
            <Reveal>
              <h2 className="font-heading text-2xl font-bold text-navy-900">Keep reading</h2>
            </Reveal>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection />
    </>
  );
}
