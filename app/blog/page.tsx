import type { Metadata } from "next"
import BlogHero from "@/components/blog-hero"
import BlogList from "@/components/blog-list"
import JsonLd from "@/components/json-ld"
import { getAllPosts } from "@/lib/posts"
import { itemListJsonLd } from "@/lib/schema"
import { absoluteUrl, site } from "@/lib/site"

const title = `Blog — Hearing health articles & guides | ${site.name}`
const description =
  "Guides on hearing aids, hearing tests, prices in Pakistan, and day-to-day hearing care. Written for people deciding what to buy next."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    url: absoluteUrl("/blog"),
    title,
    description,
    images: [{ url: site.socialImage, width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [site.socialImage],
  },
}

export default function BlogIndexPage() {
  const posts = getAllPosts()

  return (
    <>
      <JsonLd
        id="blog-itemlist-schema"
        data={itemListJsonLd(posts, absoluteUrl("/blog"), "Blog posts")}
      />

      <BlogHero
        eyebrow="The Samaat blog"
        title="Hearing health, explained"
        accent="for people in Pakistan"
        subtitle="Practical guides on hearing aids, hearing tests, prices, and care — written by the team that fits them every day."
      />

      <section className="bg-white px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="mb-8 text-sm text-grey-50">
            {posts.length} {posts.length === 1 ? "article" : "articles"}, newest first
          </p>
          <BlogList posts={posts} />
        </div>
      </section>
    </>
  )
}