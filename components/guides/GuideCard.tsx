import Image from 'next/image';
import Link from 'next/link';
import type { GuideBundle } from '@/lib/guide-contract';

export function GuideCard({ guide }: { guide: GuideBundle }) {
  const totalWords = guide.introduction.wordCount + guide.chapters.reduce((sum, chapter) => sum + chapter.wordCount, 0);
  return <Link href={`/guides/${guide.manifest.slug}/`} className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition-colors hover:border-teal-400">
    {guide.introduction.image && <div className="relative aspect-video"><Image src={guide.introduction.image.src} alt={guide.introduction.image.alt} fill sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" /></div>}
    <div className="p-7">
      <p className="text-sm text-slate-500">{guide.chapters.length} chapters · {Math.ceil(totalWords / 200)} min read</p>
      <h2 className="mt-3 font-heading text-2xl font-semibold leading-snug text-navy-900 group-hover:text-teal-700">{guide.manifest.title}</h2>
      <p className="mt-3 leading-7 text-slate-600">{guide.manifest.description}</p>
      <p className="mt-6 font-semibold text-teal-700">Read the guide</p>
    </div>
  </Link>;
}
