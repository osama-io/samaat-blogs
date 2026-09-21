/**
 * One central place for everything that used to be hard-coded.
 *
 * Values come from environment variables so the same repository can be
 * deployed as another website (or to a staging domain) without touching
 * code. Sensible defaults keep local development and preview builds working.
 */

function env(name: string, fallback = ""): string {
  return (process.env[name] ?? "").trim() || fallback
}

/** Build-time configuration. Never read outside of server components. */
export const site = {
  name: env("SITE_NAME", "Samaat.pk"),
  url: env("SITE_URL", "https://samaat.pk").replace(/\/+$/, ""),
  description: env(
    "SITE_DESCRIPTION",
    "Hearing health guides, product explainers, and buying advice for Pakistan."
  ),
  author: env("SITE_AUTHOR", "Samaat Editorial Team"),
  /** Absolute URL or a path in /public. */
  logo: env("SITE_LOGO", "/samaat-logo.png"),
  /** Default social sharing image. */
  socialImage: env("SITE_SOCIAL_IMAGE", "/opengraph-image.jpg"),
  /** Storefront this blog belongs to; empty string hides storefront links. */
  storefrontUrl: env("SITE_STOREFRONT_URL", "https://samaat.pk").replace(/\/+$/, ""),
  locale: env("SITE_LOCALE", "en_PK"),
  /** Twitter/X handle used in card metadata. */
  twitter: env("SITE_TWITTER", "@samaatpk"),
  whatsapp: env("SITE_WHATSAPP", "https://wa.me/923390000929"),
  contactEmail: env("SITE_CONTACT_EMAIL", "hello@samaat.pk"),
} as const

/** Absolute URL for a path inside this site. */
export function absoluteUrl(path: string): string {
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`
}

/** Absolute URL for the logo / social image (handles both /path and https://...). */
export function absoluteImage(url: string): string {
  return url.startsWith("http") ? url : absoluteUrl(url)
}