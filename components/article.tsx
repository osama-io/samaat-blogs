import Link from "next/link"
import Image from "next/image"
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/schema"
import { absoluteUrl, site } from "@/lib/site"
import { markdownToHtml } from "@/lib/markdown"
import { getRelatedPosts } from "@/lib/posts"
import JsonLd from "@/components/json-ld"
import type { Post } from "@/types/blog"

/**
 * Full article view. Server component: the Markdown is turned into HTML during
 * the build and shipped inside the page, so the text is present for crawlers
 * and nothing is fetched at runtime.
 */
export default function Article({ post }: { post: Post }) {
  const html = markdownToHtml(post.body)
  const related = getRelatedPosts(post)
  const url = absoluteUrl(`/blog/${post.slug}`)
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Blog", path: "/blog" },
    ...(post.category ? [{ name: post.category, path: `/category/${post.categorySlug}` }] : []),
    { name: post.title, path: `/blog/${post.slug}` },
  ])

  return (
    <article itemScope itemType="https://schema.org/BlogPosting">
      <JsonLd id="article-schema" data={articleJsonLd(post, url)} />
      <JsonLd id="breadcrumb-schema" data={breadcrumbs} />

      <section className="relative pb-16">
        <div
          className="absolute inset-0 h-full w-full"
          style={{
            background:
              "linear-gradient(to bottom, #022329 0%, #022329 70%, white 70%, white 100%)",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto w-full max-w-4xl px-6 pt-24 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-white/70">
              <li>
                <a href={site.storefrontUrl} className="transition-colors hover:text-emerald-400">
                  Home
                </a>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/blog" className="transition-colors hover:text-emerald-400">
                  Blog
                </Link>
              </li>
              {post.category && (
                <>
                  <li aria-hidden="true">/</li>
                  <li>
                    <Link
                      href={`/category/${post.categorySlug}`}
                      className="transition-colors hover:text-emerald-400"
                    >
                      {post.category}
                    </Link>
                  </li>
                </>
              )}
            </ol>
          </nav>

          <Link
            href="/blog"
            className="mb-8 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            aria-label="Back to all articles"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>
          </Link>

          {post.category && (
            <p className="mb-4">
              <Link
                href={`/category/${post.categorySlug}`}
                className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-emerald-400 hover:text-emerald-400"
              >
                {post.category}
              </Link>
            </p>
          )}

          <h1
            itemProp="headline"
            className="mb-6 text-[36px] font-bold leading-[1.15] text-grey-5 small:text-[44px]"
          >
            {post.title}
          </h1>

          <p className="mb-10 text-lg font-medium leading-[25px] text-white/75">
            {post.description}
          </p>

          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
                <span className="text-sm font-semibold text-emerald-400">
                  {post.author.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-base font-medium leading-[22px] text-grey-5" itemProp="author">
                  {post.author}
                </p>
                <p className="text-sm font-medium leading-[22px] text-white/75">
                  <time dateTime={post.publishedAt} itemProp="datePublished">
                    {post.publishedAtLabel}
                  </time>
                  <span aria-hidden="true"> · </span>
                  {post.readingMinutes} min read
                </p>
              </div>
            </div>
          </div>

          {post.updatedAtLabel && (
            <p className="mb-6 text-sm text-white/70">
              Last updated{" "}
              <time dateTime={post.updatedAt} itemProp="dateModified">
                {post.updatedAtLabel}
              </time>
            </p>
          )}

          {post.featuredImage && (
            <div className="relative aspect-[2.02/1] overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src={post.featuredImage}
                alt={post.featuredImageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 1200px"
                className="object-cover"
                priority
              />
            </div>
          )}
        </div>
      </section>

      <div className="bg-white">
        <section className="px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div
              className="blog-content"
              itemProp="articleBody"
              dangerouslySetInnerHTML={{ __html: html }}
            />

            {post.tags.length > 0 && (
              <ul className="mt-10 flex flex-wrap gap-2 border-t border-grey-20 pt-6">
                {post.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full bg-grey-10 px-3 py-1 text-xs font-medium text-grey-70"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {related.length > 0 && (
          <section className="border-t border-grey-20 px-6 py-16 lg:px-8" aria-labelledby="related-heading">
            <div className="mx-auto max-w-6xl">
              <h2 id="related-heading" className="mb-8 text-2xl font-bold text-grey-90">
                Keep reading
              </h2>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {related.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/blog/${item.slug}`}
                    className="group block rounded-2xl border border-grey-20 p-6 transition-colors hover:border-emerald-500"
                  >
                    <h3 className="mb-2 text-lg font-semibold leading-tight text-grey-90 transition-colors group-hover:text-emerald-600">
                      {item.title}
                    </h3>
                    <p className="line-clamp-2 text-sm text-grey-60">{item.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="bg-grey-5 px-6 py-12 lg:px-8">
          <div className="mx-auto flex max-w-4xl flex-col items-start gap-4 small:flex-row small:items-center small:justify-between">
            <p className="text-grey-70">
              Questions about your own hearing? Talk to the Samaat audiology team.
            </p>
            <div className="flex gap-3">
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
              >
                WhatsApp us
              </a>
              <a
                href={site.storefrontUrl}
                className="rounded-full border border-grey-30 px-5 py-2.5 text-sm font-medium text-grey-80 transition-colors hover:border-grey-80"
              >
                Browse hearing aids
              </a>
            </div>
          </div>
        </section>
      </div>
    </article>
  )
}