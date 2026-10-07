import { absoluteUrl, site } from "@/lib/site"
import type { Post } from "@/types/blog"

/**
 * JSON-LD builders. Every value here is taken from content that is visible on
 * the page: no invented ratings, review counts, or author bios.
 */

function authorNode(author: string) {
  // The editorial team is an organisation, not a person. Claiming otherwise
  // would be structured data that does not match reality.
  if (author === site.author) {
    return {
      "@type": "Organization",
      name: author,
      url: site.url,
    }
  }
  return {
    "@type": "Person",
    name: author,
  }
}

export function publisherNode() {
  return {
    "@type": "Organization",
    name: site.name,
    url: site.url,
    logo: {
      "@type": "ImageObject",
      url: site.logo.startsWith("http") ? site.logo : absoluteUrl(site.logo),
    },
  }
}

export function articleJsonLd(post: Post, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    ...(post.featuredImage ? { image: [post.featuredImage] } : {}),
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: authorNode(post.author),
    publisher: publisherNode(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    ...(post.category ? { articleSection: post.category } : {}),
    ...(post.tags.length > 0 ? { keywords: post.tags.join(", ") } : {}),
    inLanguage: "en-PK",
    url,
  }
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: site.name,
        item: site.url,
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: item.name,
        item: absoluteUrl(item.path),
      })),
    ],
  }
}

export function itemListJsonLd(posts: Post[], url: string, name: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    url,
    numberOfItems: posts.length,
    itemListElement: posts.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/blog/${post.slug}`),
      name: post.title,
    })),
  }
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${site.name} Blog`,
    url: site.url,
    description: site.description,
    inLanguage: "en-PK",
    publisher: publisherNode(),
  }
}

/**
 * FAQPage JSON-LD from a post body.
 *
 * Extracts the `### question` headings under the exact H2 "Frequently Asked
 * Questions". Only questions actually present on the page are emitted, so the
 * schema never claims content the reader cannot see.
 */
export function faqJsonLd(post: Post): { "@context": string; "@type": "FAQPage"; mainEntity: { "@type": string; name: string; acceptedAnswer: { "@type": string; text: string } }[] } | null {
  const h2 = "## Frequently Asked Questions"
  const idx = post.body.indexOf(h2)
  if (idx === -1) return null
  const section = post.body.slice(idx + h2.length)
  const nextH2 = section.indexOf("\n## ")
  const scoped = nextH2 === -1 ? section : section.slice(0, nextH2)
  const mainEntity: { "@type": string; name: string; acceptedAnswer: { "@type": string; text: string } }[] = []
  const parts = scoped.split(/### /)
  for (const part of parts) {
    const qEnd = part.indexOf("\n")
    if (qEnd === -1) continue
    const question = part.slice(0, qEnd).trim()
    if (!question) continue
    const answer = part
      .slice(qEnd)
      .trim()
      .replace(/\[(.+?)\]\(.+?\)/g, "$1")
      .replace(/\*\*/g, "")
      .replace(/\n+/g, " ")
      .trim()
    mainEntity.push({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })
  }
  if (mainEntity.length === 0) return null
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  }
}
