import type { Metadata } from 'next';
import type { GuideManifest, GuidePage } from './guide-contract';
import { SITE } from './site';

export function guidePageMetadata(manifest: GuideManifest, page: GuidePage, route: string): Metadata {
  const images = page.image ? [{ url: page.image.src, width: page.image.width, height: page.image.height, alt: page.image.alt }] : [];
  return { title: page.title, description: page.description, keywords: page.keywords,
    ...(process.env.GUIDE_PREVIEW_JOB ? { robots: { index: false, follow: false } } : {}),
    alternates: { canonical: route },
    openGraph: { type: 'article', siteName: SITE.name, locale: 'en_CA', url: route, title: page.title, description: page.description, publishedTime: manifest.publishedAt || page.date, modifiedTime: page.updated || page.date, authors: [page.author], images },
    twitter: { card: 'summary_large_image', title: page.title, description: page.description, images } };
}
export function guidePageSchema(manifest: GuideManifest, page: GuidePage, route: string) {
  const root = `${SITE.url}/guides/${manifest.slug}/`;
  return { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Article', headline: page.title, description: page.description, url: `${SITE.url}${route}`, mainEntityOfPage: `${SITE.url}${route}`, datePublished: manifest.publishedAt || page.date, dateModified: page.updated || page.date, wordCount: page.wordCount, inLanguage: 'en-CA', ...(page.image ? { image: `${SITE.url}${page.image.src}` } : {}), author: { '@type': 'Organization', name: page.author }, publisher: { '@type': 'Organization', name: SITE.legalName, url: SITE.url }, isPartOf: { '@type': 'CreativeWork', name: manifest.title, url: root } },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Software guides', item: `${SITE.url}/guides/` },
      { '@type': 'ListItem', position: 2, name: manifest.title, item: root },
      ...(page.slug === manifest.slug ? [] : [{ '@type': 'ListItem', position: 3, name: page.title, item: `${SITE.url}${route}` }])
    ] }
  ] };
}
