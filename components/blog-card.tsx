import Image from "next/image"
import Link from "next/link"
import type { Post } from "@/types/blog"

/**
 * Server component. Renders a crawlable <a> around the whole card so search
 * engines and screen readers see a normal link.
 */
export default function BlogCard({
  post,
  priority = false,
}: {
  post: Post
  priority?: boolean
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block transition-all duration-300"
    >
      <article>
        <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-2xl bg-grey-10">
          {post.featuredImage ? (
            <Image
              src={post.featuredImage}
              alt={post.featuredImageAlt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority={priority}
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-grey-20 to-grey-30" />
          )}

          {post.category && (
            <div className="absolute left-4 top-4 z-20">
              <span className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-grey-70 shadow-sm backdrop-blur-sm">
                {post.category}
              </span>
            </div>
          )}
          {post.draft && (
            <div className="absolute right-4 top-4 z-20">
              <span className="rounded-full bg-amber-400 px-3 py-1.5 text-xs font-semibold text-grey-90">
                Draft
              </span>
            </div>
          )}
        </div>

        <h3 className="mb-2 line-clamp-2 text-xl font-semibold leading-tight text-grey-90 transition-colors duration-300 group-hover:text-emerald-600">
          {post.title}
        </h3>

        <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-grey-60">
          {post.description}
        </p>

        <p className="text-xs text-grey-50">
          <time dateTime={post.publishedAt}>{post.publishedAtLabel}</time>
          <span aria-hidden="true"> · </span>
          {post.readingMinutes} min read
        </p>
      </article>
    </Link>
  )
}