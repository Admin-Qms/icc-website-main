import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/ui';
import { GuideCard } from '@/components/guides/GuideCard';
import { getAllGuides } from '@/lib/guides';
import { SITE } from '@/lib/site';
import { pageTitle } from '@/lib/seo';
import { serializeJsonLd } from '@/lib/blog';
import { GuideDraftBanner } from './GuideDraftBanner';

const description = 'Software guides for quality teams: CAPA software, document control software and more, from evaluation to rollout. Book a demo to see it in action.';
export const metadata: Metadata = {
  ...(process.env.GUIDE_PREVIEW_JOB ? { robots: { index: false, follow: false } } : {}),
  title: pageTitle('Software Guides for Quality and Operations Teams'), description,
  alternates: { canonical: '/guides/' },
  openGraph: { type: 'website', locale: 'en_CA', siteName: SITE.name, url: '/guides/', title: 'Software Guides for Quality and Operations Teams', description, images: [{ url: SITE.logo, alt: SITE.name }] },
  twitter: { card: 'summary', title: 'Software Guides for Quality and Operations Teams', description, images: [SITE.logo] },
};
export default function GuideLibraryPage() {
  const guides = getAllGuides();
  const schema = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'ICC software guides', description, url: `${SITE.url}/guides/`, hasPart: guides.map(g => ({ '@type': 'Article', name: g.manifest.title, url: `${SITE.url}/guides/${g.manifest.slug}/` })) };
  return <>
    <GuideDraftBanner />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }} />
    <PageHeader eyebrow="Software guides" title="Software guides for quality and operations teams" intro="Evaluate CAPA, document control and other quality software, map the workflow and plan a rollout. Book a demo to see it working." />
    <section className="py-16 lg:py-20"><div className="container-page">
      {guides.length ? <div className="grid gap-8 md:grid-cols-2">{guides.map(guide => <GuideCard key={guide.manifest.slug} guide={guide} />)}</div> :
        <div className="max-w-2xl border-l-4 border-teal-500 pl-7"><h2 className="font-heading text-2xl font-semibold text-navy-900">The first guides are being prepared</h2><p className="mt-4 leading-8 text-slate-600">Explore the software modules, or book a demo to see them on your workflow.</p><div className="mt-6 flex flex-wrap gap-6"><Link href="/solutions/" className="font-semibold text-teal-700 hover:underline">Explore software modules</Link><Link href="/contact/" className="font-semibold text-teal-700 hover:underline">Book a demo</Link></div></div>}
    </div></section>
  </>;
}
