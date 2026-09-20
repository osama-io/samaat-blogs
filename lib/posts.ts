import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"
import { absoluteImage, site } from "@/lib/site"
import type { Category, Post, PostFrontmatter } from "@/types/blog"

/**
 * Content loader. Reads Markdown from content/blog/ on disk at build time.
 * There is no API, no CMS, and no database in this path.
 */

const CONTENT_DIR = path.join(process.cwd(), "content", "blog")
const REQUIRED_FIELDS = ["title", "description", "slug", "publishedAt"] as const
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/** Drafts are visible in development only. Production builds never see them. */
const includeDrafts =
  process.env.NODE_ENV !== "production" || process.env.SHOW_DRAFTS === "true"

let cache: Post[] | null = null

function fail(file: string, message: string): never {
  const relative = path.relative(process.cwd(), file)
  throw new Error(
    `\nInvalid blog content: ${relative}\n  ${message}\n` +
      `  Required frontmatter: ${REQUIRED_FIELDS.join(", ")}\n` +
      `  See docs/CONTENT.md for the full format.\n`
  )
}

function asString(value: unknown): string {
  if (typeof value === "string") return value.trim()
  if (typeof value === "number") return String(value)
  // YAML parses an unquoted `2026-09-21` into a Date object.
  if (value instanceof Date) return value.toISOString()
  return ""
}

/** Accepts "2026-09-19" or an ISO timestamp; rejects anything unparseable. */
function parseDate(file: string, field: string, value: unknown, required: boolean) {
  const raw = asString(value)
  if (!raw) {
    if (required) fail(file, `"${field}" is required.`)
    return undefined
  }
  const iso = raw.length === 10 ? `${raw}T00:00:00.000Z` : raw
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    fail(file, `"${field}" is not a valid date: ${raw} (use YYYY-MM-DD).`)
  }
  return date
}

function label(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  })
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

function countWords(markdown: string): number {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
}

function parseFile(file: string): Post | null {
  const raw = fs.readFileSync(file, "utf8")
  const { data, content } = matter(raw)
  const fm = data as PostFrontmatter

  for (const field of REQUIRED_FIELDS) {
    if (!asString(fm[field])) fail(file, `"${field}" is required and cannot be empty.`)
  }

  const title = asString(fm.title)
  const description = asString(fm.description)
  const slug = asString(fm.slug)
  const publishedAt = parseDate(file, "publishedAt", fm.publishedAt, true)!
  const updatedAt = parseDate(file, "updatedAt", fm.updatedAt, false)

  if (!SLUG_PATTERN.test(slug)) {
    fail(
      file,
      `"slug" must be lowercase words separated by hyphens (got "${slug}"). ` +
        `Example: how-to-improve-seo`
    )
  }
  if (slug !== slugify(slug)) {
    fail(file, `"slug" contains characters that do not belong in a URL: ${slug}`)
  }
  if (description.length > 320) {
    fail(
      file,
      `"description" is ${description.length} characters. Keep it under 320 ` +
        `(150-160 is ideal for search results).`
    )
  }
  if (updatedAt && updatedAt < publishedAt) {
    fail(file, `"updatedAt" is earlier than "publishedAt".`)
  }
  if (!content.trim()) {
    fail(file, `the Markdown body is empty.`)
  }

  const tags = Array.isArray(fm.tags)
    ? fm.tags.map((tag) => asString(tag)).filter(Boolean)
    : []

  const category = asString(fm.category)
  const featuredImage = asString(fm.featuredImage)
  const words = countWords(content)

  return {
    title,
    description,
    slug,
    publishedAt: publishedAt.toISOString(),
    publishedAtLabel: label(publishedAt),
    updatedAt: updatedAt?.toISOString(),
    updatedAtLabel: updatedAt ? label(updatedAt) : undefined,
    author: asString(fm.author) || site.author,
    category,
    categorySlug: category ? slugify(category) : "general",
    featuredImage: featuredImage ? absoluteImage(featuredImage) : undefined,
    featuredImageAlt: asString(fm.featuredImageAlt) || title,
    tags,
    draft: fm.draft === true,
    readingMinutes: Math.max(1, Math.round(words / 220)),
    body: content,
    source: path.relative(process.cwd(), file),
  }
}

/** Every post on disk, newest first. Throws on malformed frontmatter or duplicate slugs. */
export function getAllPosts(): Post[] {
  if (cache) return cache

  if (!fs.existsSync(CONTENT_DIR)) {
    cache = []
    return cache
  }

  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((name) => /\.mdx?$/.test(name))
    .map((name) => path.join(CONTENT_DIR, name))

  const parsed = files
    .map(parseFile)
    .filter((post): post is Post => post !== null)

  const bySlug = new Map<string, Post>()
  for (const post of parsed) {
    const existing = bySlug.get(post.slug)
    if (existing) {
      throw new Error(
        `\nDuplicate slug "${post.slug}"\n  ${existing.source}\n  ${post.source}\n` +
          `  Two posts cannot share a URL. Change the "slug" in one of them.\n`
      )
    }
    bySlug.set(post.slug, post)
  }

  cache = parsed
    .filter((post) => includeDrafts || !post.draft)
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))

  return cache
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((post) => post.slug === slug)
}

export function getPostsByCategory(categorySlug: string): Post[] {
  return getAllPosts().filter((post) => post.categorySlug === slugify(categorySlug))
}

export function getAllCategories(): Category[] {
  const categories = new Map<string, Category>()

  for (const post of getAllPosts()) {
    if (!post.category) continue
    const existing = categories.get(post.categorySlug)
    if (existing) {
      existing.count += 1
      continue
    }
    categories.set(post.categorySlug, {
      name: post.category,
      slug: post.categorySlug,
      description: CATEGORY_DESCRIPTIONS[post.categorySlug],
      count: 1,
    })
  }

  return [...categories.values()].sort((a, b) => a.name.localeCompare(b.name))
}

export function getCategory(slug: string): Category | undefined {
  return getAllCategories().find((category) => category.slug === slugify(slug))
}

/** Hand-written category blurbs. Add one when a new category appears. */
const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "buying-guides":
    "Prices, models, and what to check before you pay for a hearing aid in Pakistan.",
  "hearing-health":
    "How hearing works, what the tests measure, and when to see an audiologist.",
  technology:
    "Hearing aid features explained in plain language: rechargeable, Bluetooth, AI noise reduction.",
  maintenance:
    "Looking after hearing aids so they keep working in Pakistan's heat, dust, and humidity.",
}

export function getRelatedPosts(post: Post, limit = 3): Post[] {
  const scored = getAllPosts()
    .filter((candidate) => candidate.slug !== post.slug)
    .map((candidate) => {
      let score = 0
      if (candidate.categorySlug === post.categorySlug) score += 3
      for (const tag of candidate.tags) {
        if (post.tags.includes(tag)) score += 2
      }
      return { candidate, score }
    })
    .sort((a, b) => b.score - a.score || Date.parse(b.candidate.publishedAt) - Date.parse(a.candidate.publishedAt))

  return scored.slice(0, limit).map((entry) => entry.candidate)
}