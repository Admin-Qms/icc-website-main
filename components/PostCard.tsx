import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "./Icons";
import { formatDate, type Post } from "@/lib/blog";

function Meta({ post }: { post: Post }) {
  return (
    <p className="text-xs font-medium text-slate-500">
      <time dateTime={post.date}>{formatDate(post.date)}</time>
      <span className="mx-2 text-slate-300">·</span>
      {post.readTime} min read
    </p>
  );
}

export function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="card card-hover group flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
        <Image
          src={post.image.src}
          alt={post.image.alt}
          fill
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <span className="text-xs font-bold uppercase tracking-wide text-teal-700">{post.category}</span>
        <h3 className="mt-3 font-heading text-lg font-bold leading-snug text-navy-900">{post.title}</h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">{post.description}</p>
        <div className="mt-5 flex items-center justify-between gap-4">
          <Meta post={post} />
          <ArrowRight className="h-4 w-4 shrink-0 text-teal-700 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

/** Wide lead card for the newest post on the blog index. */
export function FeaturedPostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="card card-hover group grid overflow-hidden lg:grid-cols-[1.15fr_1fr]"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100 lg:aspect-auto lg:min-h-[340px]">
        <Image
          src={post.image.src}
          alt={post.image.alt}
          fill
          priority
          sizes="(min-width: 1024px) 640px, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-col justify-center p-7 lg:p-10">
        <span className="text-xs font-bold uppercase tracking-wide text-teal-700">
          Latest · {post.category}
        </span>
        <h2 className="mt-3 font-heading text-2xl font-bold leading-tight text-navy-900 sm:text-3xl">
          {post.title}
        </h2>
        <p className="mt-3 leading-relaxed text-slate-600">{post.description}</p>
        <div className="mt-6 flex items-center justify-between gap-4">
          <Meta post={post} />
          <span className="link-arrow">
            Read article
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}
