import Link from 'next/link';
import type { GuideManifest } from '@/lib/guide-contract.cjs';

export function GuideContents({ manifest, current, titles = {} }: { manifest: GuideManifest; current?: string; titles?: Record<string, string> }) {
  const chapterLabel = (title: string) => {
    const suffix = `: ${manifest.primaryKeyword}`;
    return title.toLowerCase().endsWith(suffix.toLowerCase()) ? title.slice(0, -suffix.length) : title;
  };
  const links = <ol className="space-y-4 text-sm leading-6">
    <li><Link href={`/guides/${manifest.slug}/`} aria-current={!current ? 'page' : undefined} className={!current ? 'font-semibold text-teal-700' : 'text-slate-600 hover:text-teal-700'}>Introduction</Link></li>
    {manifest.chapters.map((chapter, index) => <li key={chapter.slug} className="flex gap-3">
      <span className="w-4 shrink-0 tabular-nums text-slate-400">{index + 1}.</span>
      <Link href={`/guides/${manifest.slug}/${chapter.slug}/`} aria-current={current === chapter.slug ? 'page' : undefined} className={`min-w-0 ${current === chapter.slug ? 'font-semibold text-teal-700' : 'text-slate-600 hover:text-teal-700'}`}>
        {chapterLabel(titles[chapter.slug] || chapter.slug.replace(/-/g, ' ').replace(/^./, c => c.toUpperCase()))}
      </Link>
    </li>)}
  </ol>;
  return <>
    <details className="rounded-xl border border-slate-200 bg-slate-50 p-5 lg:hidden">
      <summary className="cursor-pointer font-heading font-semibold text-navy-900">Guide contents</summary>
      <nav aria-label="Guide contents" className="mt-4">{links}</nav>
    </details>
    <nav aria-label="Guide contents" className="sticky top-28 hidden max-h-[calc(100dvh-8rem)] overflow-y-auto overscroll-contain border-l border-slate-200 pb-24 pl-6 lg:block">
      <p className="mb-5 font-heading font-semibold text-navy-900">Guide contents</p>{links}
    </nav>
  </>;
}
