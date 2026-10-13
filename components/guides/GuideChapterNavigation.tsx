import Link from 'next/link';
import { chapterNeighbors, type GuideManifest } from '@/lib/guide-contract';

export function GuideChapterNavigation({ manifest, current }: { manifest: GuideManifest; current: string }) {
  const navigation = chapterNeighbors(manifest, current);
  return <nav aria-label="Chapter navigation" className="mt-14 border-t border-slate-200 pt-7">
    <div className="flex flex-wrap items-center justify-between gap-5">
      {navigation.previous && <Link href={navigation.previous} rel="prev" className="font-semibold text-teal-700 hover:underline">{current === manifest.chapters[0]?.slug ? 'Introduction' : 'Previous chapter'}</Link>}
      <Link href={navigation.contents} className="text-sm text-slate-600 hover:underline">Guide contents</Link>
      {navigation.next && <Link href={navigation.next} rel="next" className="font-semibold text-teal-700 hover:underline">Next chapter</Link>}
    </div>
  </nav>;
}
