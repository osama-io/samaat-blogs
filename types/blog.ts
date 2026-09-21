/**
 * Frontmatter types for a blog post.
 *
 * The shape mirrors the frontmatter documented in app/docs/CONTENT.md.
 * Required fields are enforced at build time by lib/posts.ts.
 */

export interface PostFrontmatter {
  title: string
  description: string
  slug: string
  publishedAt: string
  updatedAt?: string
  author?: string
  category?: string
  featuredImage?: string
  featuredImageAlt?: string
  tags?: string[]
  draft?: boolean
}

export interface Post
  extends Required<Pick<PostFrontmatter, "title" | "description" | "slug" | "publishedAt">> {
  /** Raw Markdown body, frontmatter stripped. */
  body: string
  author: string
  category: string
  categorySlug: string
  featuredImage?: string
  featuredImageAlt: string
  tags: string[]
  updatedAt?: string
  draft: boolean
  /** Human readable date, e.g. "12 September 2026". */
  publishedAtLabel: string
  updatedAtLabel?: string
  /** Estimated reading time in minutes. */
  readingMinutes: number
  /** File path relative to the repo root, used in error messages. */
  source: string
}

export interface Category {
  name: string
  slug: string
  description?: string
  count: number
}