import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/ui';
import { Markdown } from '@/components/Markdown';
import { GuideContents } from '@/components/guides/GuideContents';
import { GuideChapterNavigation } from '@/components/guides/GuideChapterNavigation';
import { getGuide } from '@/lib/guides';
import { guidePageMetadata, guidePageSchema } from '@/lib/guide-metadata';
import { serializeJsonLd } from '@/lib/blog';
import { GuideDraftBanner } from './GuideDraftBanner';

export function generateMetadata({ params }: { params: { guide: string; chapter: string } }): Metadata {
  const guide = getGuide(params.guide); const page = guide?.chapters.find(c => c.slug === params.chapter);
  return guide && page ? guidePageMetadata(guide.manifest, page, `/guides/${guide.manifest.slug}/${page.slug}/`) : {};
}
export default function GuideChapter({ params }: { params: { guide: string; chapter: string } }) {
  const guide = getGuide(params.guide); const page = guide?.chapters.find(c => c.slug === params.chapter);
  if (!guide || !page) notFound();
  const index = guide.manifest.chapters.findIndex(c => c.slug === page.slug);
  return <>
    <GuideDraftBanner />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(guidePageSchema(guide.manifest, page, `/guides/${guide.manifest.slug}/${page.slug}/`)) }} />
    <PageHeader eyebrow={`Chapter ${index + 1} of ${guide.chapters.length}`} title={page.title} intro={page.description} />
    <section className="py-12 lg:py-16"><div className="container-page grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px]">
      <article className="min-w-0 max-w-3xl">
        <p className="mb-7 text-sm text-slate-500">{page.author} · {page.readTime} min read</p>
        {page.image && <Image src={page.image.src} alt={page.image.alt} width={1200} height={675} priority className="rounded-xl" />}
        <Markdown>{page.body}</Markdown>
        <GuideChapterNavigation manifest={guide.manifest} current={page.slug} />
      </article>
      <aside className="row-start-1 lg:col-start-2 lg:row-start-auto"><GuideContents manifest={guide.manifest} current={page.slug} titles={Object.fromEntries(guide.chapters.map(c => [c.slug, c.title]))} /></aside>
    </div></section>
  </>;
}
