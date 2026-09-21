/**
 * Types for the hearing-aid directory content.
 */

export interface HearingAidImage {
  /** Site path, e.g. /images/hearing-aids/rexton/inox-cic-5-1.webp */
  src: string
  alt: string
}

export type HearingAidType = "BTE" | "CIC" | "ITC"

export interface HearingAid {
  name: string
  brand: string
  brandSlug: string
  slug: string
  type: HearingAidType
  /** Placeholder value from the source sheet; the storefront shows a WhatsApp CTA instead. */
  pricePkr: number
  images: HearingAidImage[]
  /** Raw Markdown body, frontmatter stripped. */
  body: string
  source: string
}
