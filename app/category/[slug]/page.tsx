import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import BlogList from "@/components/blog-list"
import JsonLd from "@/components/json-ld"
import { getAllCategories, getCategory, getPostsByCategory } from "@/lib/posts"
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/schema"
import { absoluteUrl, site } from "@/lib/site"

interface PageProps {
  params: Promise<{ slug: string }>
}

/** One static page per category that actually has published posts. */
export function generateStaticParams() {
  return getAllCategories().map((category) => ({ slug: category.slug }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const category = getCategory(slug)

  if (!category) {
    return { title: "Category not found", robots: { index: false, follow: false } }
  }

  const title = `${category.name} articles`
  const description =
    category.description ??
    `Every ${category.name} article on the ${site.name} blog.`

  return {
    title,
    description,
    alternates: { canonical: `/category/${category.slug}` },
    openGraph: {
      type: "website",
      url: absoluteUrl(`/category/${category.slug}`),
      title: `${title} | ${site.name}`,
      description,
      images: [{ url: site.socialImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${site.name}`,
      description,
      images: [site.socialImage],
    },
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params
  const category = getCategory(slug)
  if (!category) notFound()

  const posts = getPostsByCategory(category.slug)
  const url = absoluteUrl(`/category/${category.slug}`)
  const others = getAllCategories().filter((item) => item.slug !== category.slug)

  return (
    <>
      <JsonLd id="category-itemlist-schema" data={itemListJsonLd(posts, url, `${category.name} articles`)} />
      <JsonLd
        id="category-breadcrumb-schema"
        data={breadcrumbJsonLd([{ name: category.name, path: `/category/${category.slug}` }])}
      />

      <section className="bg-[#12181d] px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-4xl text-center text-white">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center justify-center gap-2 text-sm text-white/70">
              <li>
                <a href={site.storefrontUrl} className="transition-colors hover:text-emerald-400">
                  Home
                </a>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/blog" className="transition-colors hover:text-emerald-400">
                  Blog
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-white">{category.name}</li>
            </ol>
          </nav>
          <h1 className="mb-4 text-[36px] font-bold leading-tight small:text-[48px]">
            {category.name}
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-grey-30">
            {category.description ?? `Articles filed under ${category.name}.`}
          </p>
          <p className="mt-4 text-sm text-grey-40">
            {posts.length} {posts.length === 1 ? "article" : "articles"}
          </p>
        </div>
      </section>

      <section className="bg-white px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <BlogList posts={posts} />
        </div>
      </section>

      {others.length > 0 && (
        <section className="bg-grey-5 px-6 py-12 lg:px-8" aria-labelledby="other-categories">
          <div className="mx-auto max-w-7xl">
            <h2 id="other-categories" className="mb-6 text-lg font-semibold text-grey-90">
              Other topics
            </h2>
            <ul className="flex flex-wrap gap-3">
              {others.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/category/${item.slug}`}
                    className="inline-block rounded-full border border-grey-20 bg-white px-4 py-2 text-sm font-medium text-grey-70 transition-colors hover:border-emerald-500 hover:text-emerald-700"
                  >
                    {item.name} ({item.count})
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  )
}