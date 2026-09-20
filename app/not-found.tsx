import Link from "next/link"
import type { Metadata } from "next"
import { getAllPosts } from "@/lib/posts"

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
}

export default function NotFound() {
  const posts = getAllPosts().slice(0, 3)

  return (
    <section className="px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
          404
        </p>
        <h1 className="mb-4 text-4xl font-bold text-grey-90">That page does not exist</h1>
        <p className="mb-8 text-grey-60">
          The link may be old, or the article was renamed. Everything we publish is
          listed on the blog index.
        </p>
        <Link
          href="/blog"
          className="inline-block rounded-full bg-emerald-600 px-6 py-3 font-medium text-white transition-colors hover:bg-emerald-500"
        >
          Go to all articles
        </Link>

        {posts.length > 0 && (
          <div className="mt-16 text-left">
            <h2 className="mb-4 text-lg font-semibold text-grey-90">Recently published</h2>
            <ul className="space-y-3">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-emerald-700 underline decoration-emerald-300 underline-offset-2 hover:decoration-emerald-600"
                  >
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}