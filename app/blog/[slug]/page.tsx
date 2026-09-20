import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Article from "@/components/article"
import { getAllPosts, getPostBySlug } from "@/lib/posts"
import { absoluteUrl, site } from "@/lib/site"

interface PageProps {
  params: Promise<{ slug: string }>
}

/** Every article is generated at build time. Nothing is rendered per request. */
export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    return {
      title: "Article not found",
      robots: { index: false, follow: false },
    }
  }

  const url = absoluteUrl(`/blog/${post.slug}`)
  const images = post.featuredImage
    ? [{ url: post.featuredImage, width: 1200, height: 630, alt: post.featuredImageAlt }]
    : [{ url: site.socialImage, width: 1200, height: 630, alt: post.title }]

  return {
    title: post.title,
    description: post.description,
    keywords: post.tags.length > 0 ? post.tags : undefined,
    alternates: { canonical: `/blog/${post.slug}` },
    authors: [{ name: post.author }],
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.description,
      siteName: site.name,
      locale: site.locale,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: [post.author],
      section: post.category || undefined,
      tags: post.tags.length > 0 ? post.tags : undefined,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: images.map((image) => image.url),
    },
    robots: post.draft ? { index: false, follow: false } : undefined,
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  // Unknown slug: a real 404, never a 200 page with an apology on it.
  if (!post) notFound()

  return <Article post={post} />
}