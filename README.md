# Samaat.pk Blog

A standalone, static, SEO-first blog for https://samaat.pk.

Articles are Markdown files in this repository. A push to `main` builds the site
and publishes the article. There is no CMS, no database, no backend, and no
runtime content API.

```
Markdown in Git  ->  Next.js build  ->  static HTML  ->  CDN  ->  reader
```

## Stack

- Next.js (App Router) with React Server Components
- TypeScript
- Tailwind CSS, using the same design tokens as the storefront
- `gray-matter` for frontmatter, `marked` for Markdown rendering
- No client-side data fetching for article content

## Layout

```
app/                 routes: /, /blog, /blog/[slug], /category/[slug], sitemap, robots
components/          header, footer, hero, card, list, article, JSON-LD
content/blog/        the articles (source of truth)
docs/                CONTENT.md (how to write), DEPLOYMENT.md (how to ship)
lib/                 posts loader, markdown, metadata schema, site config
scripts/             validate-content.mjs
types/               frontmatter and post types
```

## Running it

```bash
npm install
npm run dev          # http://localhost:8100, drafts visible
npm run check:content
npm run build        # production build, drafts hidden
npm run start
```

## Writing an article

Create a Markdown file in `content/blog/` with the frontmatter described in
[docs/CONTENT.md](docs/CONTENT.md), then commit and push. That is the whole
workflow.

Malformed frontmatter fails the build with the file name and the reason: a
missing title, a duplicate slug, an unparseable date, or a description over 320
characters.

## SEO behaviour

- Every article is statically generated via `generateStaticParams`.
- Per-article metadata: title, description, canonical, Open Graph, Twitter card.
- JSON-LD: `BlogPosting` on articles, `BreadcrumbList` on articles and
  categories, `ItemList` on the home and blog indexes, `WebSite` site-wide.
- `/sitemap.xml` and `/robots.txt` are generated from the content folder, so they
  update themselves when a post is added.
- Unknown slugs return a real 404 via `notFound()`.
- Draft posts never reach production pages, listings, or the sitemap.

## Design

The visual design mirrors the storefront blog, the front of the site stays the
same: the dark `#12181d` header and hero, emerald accents, rounded 2xl cards, the
same `content-container` width, and the same article typography. The two
repositories share no code and deploy independently, which is deliberate.

## Configuration

Domain, name, contact links, and defaults come from environment variables — see
[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) and `.env.example`. Nothing is
hard-coded, so the repository can be copied to launch a second site.

## Not included, on purpose

No CMS, no Firebase or Supabase, no database, no admin dashboard, no custom
server, no Docker, no authentication, no public write API. Content changes
happen through Git.