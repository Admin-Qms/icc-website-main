import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GuideHeader } from './GuideHeader';
import { GuideBody } from './GuideBody';
import { SoftwareDemoBox } from '@/components/SoftwareDemoBox';
import { GuideContents } from '@/components/guides/GuideContents';
import { getGuide } from '@/lib/guides';
import { guidePageMetadata, guidePageSchema } from '@/lib/guide-metadata';
import { serializeJsonLd } from '@/lib/blog';
import { GuideDraftBanner } from './GuideDraftBanner';

export function generateMetadata({ params }: { params: { guide: string } }): Metadata {
  const guide = getGuide(params.guide); return guide ? guidePageMetadata(guide.manifest, guide.introduction, `/guides/${guide.manifest.slug}/`) : {};
}
export default function GuideIntroduction({ params }: { params: { guide: string } }) {
  const guide = getGuide(params.guide); if (!guide) notFound();
  const { manifest, introduction } = guide;
  return <>
    <GuideDraftBanner />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(guidePageSchema(manifest, introduction, `/guides/${manifest.slug}/`)) }} />
    <GuideHeader eyebrow="Software guide" title={introduction.title} intro={introduction.description} />
    <section className="py-10 lg:py-12"><div className="container-page grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-12">
      <article className="min-w-0">
        <p className="mb-7 text-sm text-slate-500">{introduction.author} · {introduction.readTime} min read · {guide.chapters.length} chapters</p>
        {introduction.image && <Image src={introduction.image.src} alt={introduction.image.alt} width={1200} height={675} priority className="h-auto w-full rounded-xl" />}
        <GuideBody body={introduction.body} />
        <SoftwareDemoBox />
        <nav aria-label="Begin guide" className="mt-12 border-t border-slate-200 pt-7"><Link href={`/guides/${manifest.slug}/${manifest.chapters[0].slug}/`} className="font-semibold text-teal-700 hover:underline">Begin chapter 1</Link></nav>
      </article>
      <aside className="row-start-1 lg:col-start-2 lg:row-start-auto"><GuideContents manifest={manifest} titles={Object.fromEntries(guide.chapters.map(c => [c.slug, c.title]))} /></aside>
    </div></section>
  </>;
}
