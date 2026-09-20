import type { MetadataRoute } from "next"
import { absoluteUrl } from "@/lib/site"

/**
 * Crawling is open on purpose: this site exists to be found.
 * The sitemap is advertised here so crawlers do not have to guess.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  }
}