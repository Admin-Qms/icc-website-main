import Image from "next/image";

/** Rounded, bordered 16:10 photo for the PageHeader `visual` slot. */
export function HeaderPhoto({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-white bg-white shadow-[0_18px_46px_-24px_rgba(22,43,77,0.55)]">
      <Image
        src={`/images/platform/${src}`}
        alt={alt}
        fill
        priority
        unoptimized
        sizes="(min-width: 1024px) 520px, 100vw"
        className="object-cover"
      />
    </div>
  );
}
