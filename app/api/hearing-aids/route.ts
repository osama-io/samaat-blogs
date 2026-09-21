import { NextResponse } from "next/server"
import { getHearingAidBrands, getHearingAids } from "@/lib/hearing-aids"
import { absoluteUrl, site } from "@/lib/site"

/**
 * JSON feed for the hearing-aid directory.
 *
 * Image srcs are resolved to absolute URLs so an external storefront can
 * hotlink them directly. Prices in the source sheet are placeholders, so
 * only the WhatsApp contact is exposed here — the storefront shows a
 * WhatsApp CTA instead of a price.
 */

export const dynamic = "force-static"
export const revalidate = 600

export function GET(): NextResponse {
  const whatsapp = `https://wa.me/${site.whatsapp.replace(/^https?:\/\/wa\.me\//, "")}`

  const products = getHearingAids().map((aid) => ({
    slug: aid.slug,
    name: aid.name,
    brand: aid.brand,
    brand_slug: aid.brandSlug,
    type: aid.type,
    price_pkr: aid.pricePkr,
    images: aid.images.map((image) => ({
      src: absoluteUrl(image.src),
      alt: image.alt,
    })),
  }))

  return NextResponse.json(
    { whatsapp, brands: getHearingAidBrands(), products },
    {
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600",
      },
    }
  )
}
