import type { ModuleVideo as ModuleVideoSource } from "@/lib/module-videos";

export function ModuleVideo({
  name,
  slug,
  video,
}: {
  name: string;
  slug: string;
  video: ModuleVideoSource;
}) {
  const captionId = `${slug}-video-caption`;

  return (
    <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <video
        className="aspect-video w-full bg-navy-900 object-contain"
        width={1920}
        height={1080}
        controls
        playsInline
        preload="none"
        poster={video.poster}
        aria-label={`${name} video walkthrough`}
        aria-describedby={captionId}
      >
        <source src={video.src} type="video/mp4" />
        <track
          src={video.captions}
          kind="captions"
          srcLang="en"
          label="English"
        />
        <p>
          <a href={video.src}>Watch the {name} video walkthrough</a>.
        </p>
      </video>
      <figcaption
        id={captionId}
        className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm"
      >
        <span className="font-semibold text-navy-900">See {name} in action</span>
        {video.illustrative && (
          <span className="text-slate-600">Illustrative demo</span>
        )}
      </figcaption>
    </figure>
  );
}
