import { BannerDecor } from '@/components/BannerDecor';

/** The title follows the same reading column as the chapter below it. */
export function GuideHeader({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) {
  return <header className="relative overflow-hidden border-b border-slate-200 bg-blueprint pb-10 pt-28 lg:pb-12 lg:pt-36">
    <BannerDecor />
    <div className="container-page relative grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-12">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-teal-700">{eyebrow}</p>
        <h1 className="mt-4 font-heading text-3xl font-bold leading-[1.15] text-navy-900 sm:text-4xl">{title}</h1>
        <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">{intro}</p>
      </div>
    </div>
  </header>;
}
