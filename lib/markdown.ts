import { marked } from "marked"

/**
 * Markdown -> HTML at build time.
 *
 * Content comes from this repository only (trusted authors, reviewed by PR),
 * so the HTML is inserted without a client-side sanitizer. Nothing in this
 * path runs on the user's device.
 */
marked.use({
  gfm: true,
  breaks: false,
})

export function markdownToHtml(markdown: string): string {
  return marked.parse(markdown, { async: false }) as string
}

/** First N characters of plain text, cut on a word boundary. Used for excerpts. */
export function excerpt(markdown: string, length = 160): string {
  const plain = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()

  if (plain.length <= length) return plain
  return `${plain.slice(0, plain.lastIndexOf(" ", length))}...`
}