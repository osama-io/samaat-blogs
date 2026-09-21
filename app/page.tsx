import Link from "next/link"
import type { Metadata } from "next"
import BlogHero from "@/components/blog-hero"
import BlogList from "@/components/blog-list"
import JsonLd from "@/components/json-ld"
import { getAllCategories, getAllPosts } from "@/lib/posts"
import { itemListJsonLd } from "@/lib/schema"
import { absoluteUrl, site } from "@/lib/site"

export const metadata: Metadata = {
  title: `${site.name} Blog — Hearing health guides for Pakistan`,
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    title: `${site.name} Blog`,
    description: site.description,
    images: [{ url: site.socialImage, width: 1200, height: 630, alt: `${site.name} Blog` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} Blog`,
    description: site.description,
    images: [site.socialImage],
  },
}

export default function HomePage() {
  const posts = getAllPosts()
  const categories = getAllCategories()
  const [lead, ...rest] = posts

  return (
    <>
      <BlogHero
        title="Expert insights in"
        accent="hearing health & technology"
        subtitle={site.description}
      />

      {lead && (
        <section className="px-6 py-16 lg:px-8" aria-labelledby="latest-heading">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-4xl text-center">
              <h2 id="latest-heading" className="mb-3 text-2xl font-bold text-grey-90">
                Latest article
              </h2>
              <p className="mb-10 text-grey-60">
                <Link
                  href={`/blog/${lead.slug}`}
                  className="text-emerald-700 underline decoration-emerald-300 underline-offset-2 hover:decoration-emerald-600"
                >
                  {lead.title}
                </Link>
                <span aria-hidden="true"> · </span>
                <time dateTime={lead.publishedAt}>{lead.publishedAtLabel}</time>
              </p>
            </div>
            <BlogList posts={rest.length > 0 ? rest : posts} />
          </div>
        </section>
      )}

      {categories.length > 0 && (
        <section className="bg-grey-5 px-6 py-16 lg:px-8" aria-labelledby="categories-heading">
          <div className="mx-auto max-w-7xl">
            <h2 id="categories-heading" className="mb-8 text-2xl font-bold text-grey-90">
              Browse by topic
            </h2>
            <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="group block h-full rounded-2xl border border-grey-20 bg-white p-6 transition-colors hover:border-emerald-500"
                  >
                    <h3 className="mb-2 text-lg font-semibold text-grey-90 transition-colors group-hover:text-emerald-600">
                      {category.name}
                    </h3>
                    <p className="mb-4 text-sm leading-relaxed text-grey-60">
                      {category.description ?? "Articles in this category."}
                    </p>
                    <p className="text-xs font-medium uppercase tracking-wide text-grey-50">
                      {category.count} {category.count === 1 ? "article" : "articles"}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <JsonLd id="home-itemlist-schema" data={itemListJsonLd(posts, absoluteUrl("/"), "Samaat.pk blog articles")} />
    </>
  )
}