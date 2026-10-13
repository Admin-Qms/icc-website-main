import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import GuideLibraryPage, { metadata as libraryMetadata } from '@/components/guides/GuideLibraryPage';
import GuideIntroductionPage, { generateMetadata as introductionMetadata } from '@/components/guides/GuideIntroductionPage';
import GuideChapterPage, { generateMetadata as chapterMetadata } from '@/components/guides/GuideChapterPage';
import { getAllGuides } from '@/lib/guides';

// The library entry keeps static export possible before the first guide exists.
export const dynamic = 'force-static';
export function generateStaticParams() {
  return [{ path: [] as string[] }, ...getAllGuides().flatMap(guide => [
    { path: [guide.manifest.slug] },
    ...guide.chapters.map(chapter => ({ path: [guide.manifest.slug, chapter.slug] })),
  ])];
}
export function generateMetadata({ params }: { params: { path?: string[] } }): Metadata {
  const parts = params.path || [];
  if (!parts.length) return libraryMetadata;
  if (parts.length === 1) return introductionMetadata({ params: { guide: parts[0] } });
  if (parts.length === 2) return chapterMetadata({ params: { guide: parts[0], chapter: parts[1] } });
  return {};
}
export default function GuideRoute({ params }: { params: { path?: string[] } }) {
  const parts = params.path || [];
  if (!parts.length) return <GuideLibraryPage />;
  if (parts.length === 1) return <GuideIntroductionPage params={{ guide: parts[0] }} />;
  if (parts.length === 2) return <GuideChapterPage params={{ guide: parts[0], chapter: parts[1] }} />;
  notFound();
}
