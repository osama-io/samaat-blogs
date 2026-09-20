import Link from "next/link"
import Image from "next/image"
import { site } from "@/lib/site"
import { getAllCategories } from "@/lib/posts"

export default function SiteFooter() {
  const categories = getAllCategories()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/10 bg-[#12181d]" role="contentinfo">
      <div className="content-container py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 small:grid-cols-4">
          <div>
            <Image
              src={site.logo}
              alt={site.name}
              width={130}
              height={37}
              className="mb-4 h-[28px] w-auto object-contain"
            />
            <p className="text-sm leading-relaxed text-grey-30">
              {site.description}
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-semibold text-white">Blog</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="text-sm text-grey-30 transition-colors hover:text-emerald-400">
                  All articles
                </Link>
              </li>
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="text-sm text-grey-30 transition-colors hover:text-emerald-400"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-semibold text-white">Samaat.pk</h2>
            <ul className="space-y-2">
              <li>
                <a
                  href={site.storefrontUrl}
                  className="text-sm text-grey-30 transition-colors hover:text-emerald-400"
                >
                  Shop hearing aids
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.contactEmail}`}
                  className="text-sm text-grey-30 transition-colors hover:text-emerald-400"
                >
                  {site.contactEmail}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-semibold text-white">Talk to us</h2>
            <ul className="space-y-2">
              <li>
                <a
                  href={site.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-grey-30 transition-colors hover:text-emerald-400"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={`${site.storefrontUrl}/contact`}
                  className="text-sm text-grey-30 transition-colors hover:text-emerald-400"
                >
                  Contact &amp; clinic hours
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-grey-40 small:flex-row small:items-center small:justify-between">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <p>
            Information on this blog is educational and does not replace a hearing
            test by a qualified audiologist.
          </p>
        </div>
      </div>
    </footer>
  )
}