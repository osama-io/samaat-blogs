#!/usr/bin/env node
/**
 * Standalone content check.
 *
 * The Next.js build refuses to compile malformed frontmatter, but that error
 * only appears at build time and only for the first bad file. This script lets
 * an automation (or a person) validate everything in content/blog/ before
 * committing, and reports every problem in one pass.
 *
 *   npm run check:content
 */
import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"

const CONTENT_DIR = path.join(process.cwd(), "content", "blog")
const REQUIRED = ["title", "description", "slug", "publishedAt"]
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const problems = []

function check(file, condition, message) {
  if (!condition) problems.push(`${path.relative(process.cwd(), file)}: ${message}`)
}

if (!fs.existsSync(CONTENT_DIR)) {
  console.error(`No content directory at ${CONTENT_DIR}`)
  process.exit(1)
}

const files = fs
  .readdirSync(CONTENT_DIR)
  .filter((name) => /\.mdx?$/.test(name))
  .map((name) => path.join(CONTENT_DIR, name))

const seen = new Map()

for (const file of files) {
  const { data, content } = matter(fs.readFileSync(file, "utf8"))

  for (const field of REQUIRED) {
    const value = data[field]
    const filled =
      (typeof value === "string" && value.trim().length > 0) || value instanceof Date
    check(file, filled, `missing "${field}"`)
  }
  if (typeof data.slug === "string") {
    check(file, SLUG_PATTERN.test(data.slug), `slug "${data.slug}" is not lowercase-with-hyphens`)
    const clash = seen.get(data.slug)
    check(file, !clash, `slug "${data.slug}" is already used by ${clash}`)
    seen.set(data.slug, path.basename(file))
  }
  if (data.publishedAt instanceof Date) {
    check(file, !Number.isNaN(data.publishedAt.getTime()), `"publishedAt" is not a valid date`)
  } else if (typeof data.publishedAt === "string") {
    check(
      file,
      data.publishedAt.length === 10
        ? /^\d{4}-\d{2}-\d{2}$/.test(data.publishedAt)
        : !Number.isNaN(Date.parse(data.publishedAt)),
      `"publishedAt" must be YYYY-MM-DD or an ISO timestamp`
    )
  }
  if (typeof data.description === "string") {
    check(
      file,
      data.description.length <= 320,
      `description is ${data.description.length} characters (max 320)`
    )
  }
  check(file, content.trim().length > 0, "body is empty")
}

const drafts = files.filter((file) => matter(fs.readFileSync(file, "utf8")).data.draft === true)

if (problems.length > 0) {
  console.error(`\n${problems.length} problem(s) found:\n`)
  for (const problem of problems) console.error(`  - ${problem}`)
  console.error("")
  process.exit(1)
}

console.log(
  `${files.length} post(s) valid. ${drafts.length} draft(s) will be hidden in production.`
)
