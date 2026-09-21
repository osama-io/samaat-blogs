import type { NextConfig } from "next"

/**
 * The blog is fully static: Markdown -> build -> HTML -> CDN.
 * Image optimisation is disabled on purpose so there is no runtime
 * dependency on a Next.js server or on a third-party image service.
 * Featured images are referenced by absolute URL (Cloudinary / Unsplash),
 * compressed by the host, and sized explicitly to avoid layout shift.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    unoptimized: true,
  },
  experimental: {
    // Markdown files are read from disk at build time only.
    optimizePackageImports: [],
  },
}

export default nextConfig