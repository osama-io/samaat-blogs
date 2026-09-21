import type { Metadata, Viewport } from "next"
import { Manrope } from "next/font/google"
import "./globals.css"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import JsonLd from "@/components/json-ld"
import { websiteJsonLd } from "@/lib/schema"
import { site } from "@/lib/site"

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} Blog — Hearing health guides for Pakistan`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: `${site.name} Blog`,
  authors: [{ name: site.author, url: site.storefrontUrl }],
  creator: site.author,
  publisher: site.name,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: `${site.name} Blog`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    site: site.twitter,
    creator: site.twitter,
  },
  formatDetection: { email: false, address: false, telephone: false },
}

export const viewport: Viewport = {
  themeColor: "#12181d",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={manrope.variable}>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-emerald-600 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg"
        >
          Skip to main content
        </a>
        <JsonLd id="website-schema" data={websiteJsonLd()} />
        <SiteHeader />
        <main id="main-content" className="relative">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  )
}