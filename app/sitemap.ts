import type { MetadataRoute } from "next"
import { getAllCategories, getAllPosts } from "@/lib/posts"
import { absoluteUrl } from "@/lib/site"

/**
 * Generated from the content folder at build time, so a new Markdown file is
 * in the sitemap as soon as it is pushed. Nothing to maintain by hand.
 * Drafts are excluded because the loader never returns them in production.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()
  const categories = getAllCategories()
  const newestPost = posts[0] ? Date.parse(posts[0].publishedAt) : new Date()

  return [
    {
      url: absoluteUrl("/"),
      lastModified: new Date(newestPost),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: absoluteUrl("/blog"),
      lastModified: new Date(newestPost),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...categories.map((category) => ({
      url: absoluteUrl(`/category/${category.slug}`),
      lastModified: new Date(newestPost),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...posts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: new Date(post.updatedAt ?? post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ]
}