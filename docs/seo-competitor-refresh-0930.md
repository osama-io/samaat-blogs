# Samaat.pk — SEO & Competitor Gap Analysis (Sep 30, 2026 refresh)

Follow-up to `docs/seo-keyword-plan.md` after Wave 1–4 content shipped
(24 posts live at `www.samaat.pk/blog/*`, storefront hardened).
This file records what changed in the SERP since that plan and the concrete,
prioritized plan for the storefront + blog next.

## 1. Where we stand (verified live, Sep 30)

- All 24 planned posts render at `www.samaat.pk/blog/<slug>` (Git-as-CMS via jsDelivr from samaat-blogs `main`). Funnelling to storefront /shop + WhatsApp CTA works.
- Sitemap: 74 URLs, 23 blog posts included. `llms.txt` live at root.
- Storefront structured data is strong: `Organization`, `LocalBusiness`, `FAQPage`, `HowTo`, `AggregateRating/Review` on `/`; `Product`+`Offer` on every product page; `CollectionPage`+`ItemList` on shop/brand pages.
- Blog posts carry `BlogPosting` + `BreadcrumbList` but **no `FAQPage` JSON-LD** — the plan's §3 spec is not yet emitted; gap below.
- Blog subdomain `blog.samaat.pk` does **not resolve in public DNS** — the blog-hosting-next-app was never deployed. There is no duplicate-content risk because canonicals resolve to `www.samaat.pk/blog/*`, but the standalone blog app (samaat-blogs Next.js deployment) is dead weight until hosted, OR we accept www.samaat.pk/blog as the only blog surface (recommended).

## 2. Competitor refresh (top calibration)

| Competitor | What they own | Gap we can take |
|---|---|---|
| idealhearingcare.com (Rawalpindi) | Ranking price pillar + **Urdu post** (`kan-ki-machine-ki-qeemat-pakistan-2026`) + rechargeable + buyers-guide; tier tables + FAQs | We have zero Urdu content. Urdu long-tail (`کان کی مشین کی قیمت`, `samaat ki kami ka ilaj`) is unserved and they rank for it from ONE post |
| professionalhearingsolution.com (Isb/Rwp) | ~10 city/brand posts, "programmed to your audiogram before shipping" trust mechanic, PTA+Tympanometry services | Their posts are keyword-stuffed with **no comparison tables**. Our brand/model directory (per-model PKR pages) is deeper — keep building it (A&M, Oticon, Widex model pages) |
| awclahore.online (**new since plan**) | Lahore per-model product pages w/ exact PKR prices + WhatsApp + home fitting | Directly eats our Lahore/city long-tail. We must win more of `hearing aid price in lahore` — our city pages exist but are only 3 |
| hearingaidskarachi.com | Karachi traffic on brand match | USD placeholders, brochure-grade, no prices in PKR. Beatable with our Karachi page + model pages |
| hamzasurgical / generic sellers | Cheap "Rs 1,499" amplifier bait | Keep hammering the trust gap in every money page (authentic-only, warranty, 30-day returns) |
| daraz/olx | Volume | Our daraz/olx comparison post already planted; needs reviews/Q&A to convert |

## 3. Prioritized plan (what to build next)

Wave A — storefront tier (highest leverage, do first)
1. **A&M model pages** (Rexton/Signia/Interton exist in the hearing-aids directory; A&M + Widex + Oticon are thin). Prices in Pakistan start at Rs 8,000 here — cheapest-genuine angle no competitor except idealhearingcare covers, and their post is generic. Add `cheapest true hearing aid price pakistan` money content → link to A&M directory + product pages.
2. **Add `FAQPage` JSON-LD to every blog post** (plan §3 spec not implemented). The posts already have FAQ sections — emitting the JSON-LD is a template change in the blog component (`components/article/`), zero content work.
3. **Per-model city variants**: three city pages exist (Lahore/Karachi/Islamabad). Add `top 5 hearing aids under Rs 50,000` style model×city listicles — long tail both `awclahore` and `phs` rank for, currently no good competitor page.

Wave B — Urdu/GEO expansion
4. Publish **one Urdu equivalent post per money pillar** (`hearing-aid-price`, `best hearing aid`, `rechargeable`) in Urdu + frontmatter direction. idealhearingcare proves Google surfaces it.
5. Keep llms.txt updated to list new URLs (already automated from sitemap? verify — currently static).

Wave C — technical hygiene
6. Fix remote `blog` fetch revalidate behavior confirmed working (ISR picks up new posts within ~10 min) — monitor only.
7. `draft-example-post.md` blocks a sitemap slot if ever renamed — remove drafts from the /blog list (currently `page-7aeaef5413580c91` appears in listing but not sitemap; audit why).
8. Search Console: submit updated sitemap + request indexing for the 12 Wave-1/2 pages (user action, needs GSC login).

## 4. Execution notes

- Wave A items 1–3 need model/price data — pull from samaat-blogs `content/hearing-aids/*` (extends the existing directory pattern).
- Wave B needs Urdu copy — human-reviewed; do not machine-generate without Osama's pass.
- Measurements: track `blog` impressions weekly in GSC; SERP probes today were manual — repeat competitor refresh quarterly (cron candidate already noted in original plan).
