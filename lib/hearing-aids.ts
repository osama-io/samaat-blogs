import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"
import type { HearingAid } from "@/types/hearing-aids"

/**
 * Content loader for the hearing-aid directory. Reads Markdown from
 * content/hearing-aids/ on disk at build time — same pattern as lib/posts.ts.
 */

const CONTENT_DIR = path.join(process.cwd(), "content", "hearing-aids")
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const TYPES = new Set(["BTE", "CIC", "ITC"])

let cache: HearingAid[] | null = null

function fail(file: string, message: string): never {
  const relative = path.relative(process.cwd(), file)
  throw new Error(`\nInvalid hearing-aid content: ${relative}\n  ${message}\n`)
}

function asString(value: unknown): string {
  if (typeof value === "string") return value.trim()
  if (typeof value === "number") return String(value)
  return ""
}

function parseFile(file: string): HearingAid {
  const raw = fs.readFileSync(file, "utf8")
  const { data, content } = matter(raw)

  const name = asString(data.name)
  const brand = asString(data.brand)
  const brandSlug = asString(data.brand_slug)
  const slug = asString(data.slug)
  const type = asString(data.type)
  const pricePkr = typeof data.price_pkr === "number" ? data.price_pkr : 0

  for (const [field, value] of Object.entries({ name, brand, brand_slug: brandSlug, slug })) {
    if (!value) fail(file, `"${field}" is required and cannot be empty.`)
  }
  if (!SLUG_PATTERN.test(slug)) {
    fail(file, `"slug" must be lowercase words separated by hyphens (got "${slug}").`)
  }
  if (!TYPES.has(type)) {
    fail(file, `"type" must be one of BTE, CIC, ITC (got "${type}").`)
  }
  if (!content.trim()) {
    fail(file, "the Markdown body is empty.")
  }

  const images = Array.isArray(data.images)
    ? data.images.map((image: unknown) => {
        const entry = image as { src?: unknown; alt?: unknown }
        const src = asString(entry.src)
        if (!src) fail(file, "every image needs a src path.")
        return { src, alt: asString(entry.alt) || name }
      })
    : []

  return {
    name,
    brand,
    brandSlug,
    slug,
    type: type as HearingAid["type"],
    pricePkr,
    images,
    body: content.trim(),
    source: path.relative(process.cwd(), file),
  }
}

/** Every hearing aid on disk. Throws on malformed frontmatter or duplicate slugs. */
export function getHearingAids(): HearingAid[] {
  if (cache) return cache

  if (!fs.existsSync(CONTENT_DIR)) {
    cache = []
    return cache
  }

  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((name) => /\.mdx?$/.test(name))
    .map((name) => path.join(CONTENT_DIR, name))

  const parsed = files.map(parseFile)

  const bySlug = new Map<string, HearingAid>()
  for (const aid of parsed) {
    const existing = bySlug.get(aid.slug)
    if (existing) {
      throw new Error(
        `\nDuplicate hearing-aid slug "${aid.slug}"\n  ${existing.source}\n  ${aid.source}\n`
      )
    }
    bySlug.set(aid.slug, aid)
  }

  cache = parsed.sort((a, b) => a.name.localeCompare(b.name))
  return cache
}

export function getHearingAidBrands(): { slug: string; name: string }[] {
  const brands = new Map<string, string>()
  for (const aid of getHearingAids()) {
    if (!brands.has(aid.brandSlug)) brands.set(aid.brandSlug, aid.brand)
  }
  return [...brands.entries()]
    .map(([slug, name]) => ({ slug, name }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export function getHearingAidBySlug(slug: string): HearingAid | undefined {
  return getHearingAids().find((aid) => aid.slug === slug)
}
