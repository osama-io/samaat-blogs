import Link from "next/link"
import Image from "next/image"
import { site } from "@/lib/site"
import { getAllCategories } from "@/lib/posts"

/**
 * Server component. No client JavaScript, no cart, no state: the blog is
 * read-only. Links back to the storefront are absolute URLs.
 */
export default function SiteHeader() {
  const categories = getAllCategories()

  return (
    <nav
      className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#12181d]"
      aria-label="Blog navigation"
    >
      <div className="content-container">
        <div className="flex h-[64px] items-center gap-6">
          <Link href="/" className="flex flex-shrink-0 items-center" aria-label={`${site.name} blog home`}>
            <Image
              src={site.logo}
              alt={site.name}
              width={140}
              height={39}
              className="h-[30px] w-auto object-contain"
              priority
            />
          </Link>

          <ul className="hidden items-center gap-6 small:flex">
            <li>
              <Link
                href="/blog"
                className="text-sm font-medium text-grey-20 transition-colors hover:text-emerald-400"
              >
                All articles
              </Link>
            </li>
            {categories.slice(0, 4).map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/category/${category.slug}`}
                  className="text-sm font-medium text-grey-20 transition-colors hover:text-emerald-400"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="ml-auto flex items-center gap-3">
            <a
              href={site.storefrontUrl}
              className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-emerald-400 hover:text-emerald-400"
            >
              Shop hearing aids
            </a>
            <a
              href={site.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500 xsmall:block"
            >
              WhatsApp
            </a>
          </div>
        </div>

        {/* Category row stays crawlable on narrow screens too. */}
        <div className="flex flex-wrap gap-x-5 gap-y-2 pb-3 small:hidden">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="text-xs font-medium text-grey-40 transition-colors hover:text-emerald-400"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}