import BlogCard from "@/components/blog-card"
import type { Post } from "@/types/blog"

/**
 * Grid of post cards. Every card is a plain link, so the whole index is
 * crawlable without JavaScript.
 */
export default function BlogList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <div className="mx-auto max-w-4xl py-16 text-center">
        <div className="rounded-xl border border-grey-20 bg-grey-5 p-12">
          <p className="mb-2 text-sm text-grey-50">No articles yet</p>
          <h2 className="mb-3 text-2xl font-semibold text-grey-90">
            Published articles will appear here
          </h2>
          <p className="text-grey-60">
            Add a Markdown file to <code>content/blog/</code> and push it to GitHub.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, index) => (
        <BlogCard key={post.slug} post={post} priority={index < 3} />
      ))}
    </div>
  )
}