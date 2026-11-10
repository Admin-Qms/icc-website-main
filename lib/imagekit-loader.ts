// next/image loader for the static export: ImageKit fetches each file from the live
// site (its Web Folder origin) and serves it at the width the browser asks for.
// Development keeps the local file, so images that are not deployed yet still show.
export const IMAGEKIT_URL = "https://ik.imagekit.io/ysgvhleg8";

type LoaderProps = { src: string; width: number; quality?: number };

export function imageKitSrc(
  endpoint: string | undefined,
  { src, width, quality }: LoaderProps,
): string {
  if (!endpoint || !src.startsWith("/")) return src;
  // c-at_max never enlarges past the original; f-auto picks AVIF or WebP per browser.
  return `${endpoint.replace(/\/$/, "")}${src}?tr=w-${width},c-at_max,q-${quality ?? 80},f-auto`;
}

export default function imageKitLoader(props: LoaderProps): string {
  return imageKitSrc(
    process.env.NODE_ENV === "production" ? IMAGEKIT_URL : undefined,
    props,
  );
}
