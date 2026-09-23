# Samaat Hearing Aids — SEO + GEO Content Plan (Sep 2026)

Source: `keyword-research.csv` (Desktop, 27 keywords). Target site: `blog.samaat.pk`
(samaat-blogs). Goal: own the Pakistan hearing-aid buying journey in both Google
and AI assistants (ChatGPT/Perplexity/Gemini/AI Overviews), funnelling to the
samaat.pk storefront "Call on WhatsApp" CTA.

## 1. Keyword → page mapping

Priority = volume × intent × weak-competition opportunity from the CSV.

| # | Target keyword(s) | Vol | Intent | Priority | New/Existing page | Cluster |
|---|---|---|---|---|---|---|
| 1 | hearing aid price in pakistan | 2400 | commercial | P0 | **REWRITE** `hearing-aid-prices-in-pakistan-2026.md` | Money |
| 2 | hearing machine price in pakistan | 2400 | commercial | P0 | same page (H2 + FAQ variant) | Money |
| 3 | best hearing aid price in pakistan | 260 | commercial | P0 | NEW `best-hearing-aid-price-in-pakistan.md` | Money |
| 4 | phonak hearing aid price in pakistan | 260 | commercial | P0 | NEW `phonak-hearing-aid-prices-pakistan.md` | Brands |
| 5 | rexton hearing aid price in pakistan | 210 | commercial | P1 | NEW `rexton-hearing-aid-prices-pakistan.md` | Brands |
| 6 | widex hearing aid price in pakistan | 50 | transactional | P1 | NEW `widex-hearing-aid-prices-pakistan.md` | Brands |
| 7 | digital hearing aid price in pakistan | 140 | commercial | P1 | NEW `digital-hearing-aids-pakistan-price-guide.md` | Types |
| 8 | invisible hearing aid price in pakistan | 140 | commercial | P1 | **UPDATE** `invisible-hearing-aids-pakistan-cic-iic-guide.md` (add price tables) | Types |
| 9 | rechargeable hearing aid price in pakistan | 70 | commercial | P1 | **UPDATE** `best-rechargeable-hearing-aids-in-pakistan-2026-guide.md` | Types |
| 10 | hearing aid price in karachi / lahore / islamabad | 90/210/30 | local | P1 | NEW city pages ×3 (template) | Local |
| 11 | hearing aids near me | 480 | transactional | P1 | land on store locator page (storefront tier) — blog supports via cluster link | Local |
| 12 | hearing aid price in pakistan daraz / olx | 320/110 | commercial | P2 | one comparison post `hearing-aids-daraz-olx-vs-dealer-pakistan.md` | Money |
| 13 | hearing aids types | 110 | informational | P1 | **UPDATE/merge** `understanding-hearing-loss-solutions-pakistan.md` + types guide | Learn |
| 14 | hearing aid types and costs | 40 | informational | P1 | NEW `hearing-aid-types-and-costs-pakistan.md` | Learn |
| 15 | hearing aids best / best hearing aid in pakistan | 90/110 | commercial | P1 | `best-hearing-aid-in-pakistan.md` (round-up, merged with #3 or sibling) | Money |
| 16 | best hearing aid in lahore | 30 | transactional | P2 | covered by Lahore city page | Local |
| 17 | hearing aids bluetooth | 50 | transactional | P2 | **UPDATE** `bluetooth-hearing-aids-pakistan-guide.md` | Learn |
| 18 | hearing aids brands | 10 | informational | P2 | NEW short `hearing-aid-brands-in-pakistan.md` (hub linking all brand pages) | Brands |
| 19 | disadvantages of hearing aids | 10 | informational | P3 | NEW `disadvantages-of-hearing-aids-honest-guide.md` | Learn |
| 20 | hearing aids amazon | 10 | transactional | P3 | skip (not our market) | — |

## 2. Theme clusters (internal-linking graph)

1. **Money cluster** — prices 2026 (pillar) ⇄ best-hearing-aid-price ⇄ daraz/olx
   comparison ⇄ every brand page ⇄ every city page. All link to storefront
   product pages and WhatsApp CTA.
2. **Brands cluster** — hub `hearing-aid-brands-in-pakistan` → Phonak / Signia(exists
   implicitly) / Rexton / Widex / (later: Oticon, Starkey, Interton). Brand pages
   cross-link to the price pillar and the matching type page.
3. **Types cluster** — types pillar → invisible (CIC/IIC) → rechargeable →
   digital → bluetooth → battery sizes (exists).
4. **Learn cluster** — existing educational posts (tinnitus, hearing test, care)
   stay as supporting authority; types-and-costs + disadvantages feed top-funnel.
5. **Local cluster** — Lahore / Karachi / Islamabad city pages, each linking to
   near-me support, brand pages (which clinics stock them), and the storefront.

## 3. On-page SEO template (every post)

- Slug = exact head keyword where possible (`hearing-aid-prices-in-pakistan-2026`).
- Title ≤ 60 chars, keyword front-loaded; meta description ≤ 155 chars with a
  number ("Rs 25,000–550,000") and a benefit.
- H1 = title variant; first 100 words must contain the keyword + price band
  (E-E-A-T signal for both Google overlays and LLM extraction).
- One comparison table minimum (price bands / brand tiers) — tables are the
  format most quoted by AI Overviews and Perplexity.
- FAQ section: 4–6 real questions, exported as `FAQPage` JSON-LD.
- `Article` + `BreadcrumbList` JSON-LD (verify existing template emits them,
  plain `<script type="application/ld+json">` in SSR — per repo rule).
- Internal links: ≥3 up-cluster, ≥2 down-cluster, 1 to storefront/WhatsApp.
- Image: Unsplash/orig with descriptive `featuredImageAlt` containing keyword.
- Author line "Samaat Editorial Team" + reviewed-by note (trust).

## 4. AI-SEO / GEO rules baked into every post

1. **Answer-first:** first paragraph gives the direct final answer (50–60 word
   quotable block) — this is what LLMs lift verbatim.
2. **Crawlability:** allow AI crawlers in `robots.txt` (GPTBot, ClaudeBot,
   PerplexityBot, Google-Extended, CCBot, Bytespider). Add `llms.txt` at site
   root listing the pillar + cluster URLs and what each page answers.
3. **Entity grounding:** name brands/models/cities everywhere; LLMs cite pages
   with unambiguous entities, not vague prose.
4. **Freshness:** explicit "Updated <Month Year>" line at top; price tables
   re-verified quarterly (cron candidate).
5. **Consistency across pages:** the same price band table appears (and
   matches) on the pillar, brand pages, and city pages — conflicting numbers
   across pages make LLMs pick a competitor.
6. **Quotes/statistics formatting:** GEO research (Aggarwal et al., Kdd'24)
   shows quotations, citations and concrete figures boost AI-citation rates —
   keep numbers specific, cite sources inline ("per model-year") where used.
7. **No fluff:** LLM retrieval keeps passages, not pages — keep every section
   self-contained with its own mini-conclusion.

## 5. Competitive analysis summary (what we beat)

Studied top SERP players for "hearing aid price in pakistan":

| Competitor | Strength | Weakness we exploit |
|---|---|---|
| siemenshearingsolutions.com | Deep 3-column price catalog, structured tiers | Walls off prices by China/Singapore/"German" columns — confusing; 6-min thin read |
| idealhearingcare.com (Rawalpindi) | Beautiful tiered price table, FAQ, warranty info | Single location, ignores Lahore/Karachi; no brand deep-dives |
| professionalhearingsolution.com | Multiple city + brand posts (Signia focus) | Keyword-stuffed titles, no comparison tables, ads-heavy |
| hamzasurgical.com | Ranks on "price… Rs 1,499 onwards" | Selling amplifiers, not hearing aids — bait pricing |
| hearingclinic.com.pk | Domain authority Lahore | Static brochure, near-zero blog content |
| daraz/olx listings | High traffic capture | No warranty/fitting guidance — huge trust gap |

**Winning formula:** Samaat = transparent price bands table (single, honest,
converted-PKR) × brand deep dives × city pages × free-trial/WhatsApp guidance
× FAQ JSON-LD × AI-citable answer blocks. Nobody in the SERP has all six.

## 6. Execution order (UKG: user keyword grades, largest first)

Wave 1 (P0, this PR): rewrite price pillar, new best-price page, new Phonak page.
Wave 2 (P1): Rexton, Widex, digital, invisible+rechargeable price-table updates,
types-and-costs.
Wave 3 (P1): city pages template ×3 (Lahore first — includes `hearing aid lahore`
navigational intent), brands hub.
Wave 4 (P2/P3): daraz/olx comparison, bluetooth update, disadvantages page.

Each post ships as its own commit on this branch; final PR merges all.
Post-merge: verify sitemap picks them up, submit sitemap in Search Console
(user action), monitor impressions weekly.
