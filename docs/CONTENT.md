# Writing a blog post

Every article is a Markdown file in `content/blog/`. There is no CMS, no
database, and no admin panel. You write a file, commit it, push it, and the
article is live a minute later.

## The file

```
content/blog/how-to-improve-seo.md
```

The filename does not matter. The `slug` in the frontmatter decides the URL.

## Frontmatter

```yaml
---
title: "Hearing Aid Prices in Pakistan (2026): What You Actually Pay"
description: "Real price bands for hearing aids in Pakistan in 2026, what changes the price, why clinic quotes are higher, and the hidden costs to ask about first."
slug: hearing-aid-prices-in-pakistan-2026
publishedAt: 2026-09-21
updatedAt: 2026-09-25
author: Samaat Editorial Team
category: Buying Guides
featuredImage: https://images.unsplash.com/photo-1596088728260-08a654466a00?auto=format&fit=crop&w=1200&q=80
featuredImageAlt: Small hearing aid held between two fingers
tags: ["hearing aid prices", "hearing aids Pakistan", "cost"]
draft: false
---

Your article starts here.
```

### Required

| Field | Rules |
| :--- | :--- |
| `title` | Plain text. Becomes the `<h1>` and the page title. |
| `description` | 150–160 characters is ideal, 320 is the hard limit. Used as the meta description, the Open Graph description, and the excerpt on cards. |
| `slug` | Lowercase words separated by hyphens. Becomes `/blog/<slug>`. Must be unique. |
| `publishedAt` | `YYYY-MM-DD`. Controls sort order, newest first. |

### Optional

| Field | Rules |
| :--- | :--- |
| `updatedAt` | `YYYY-MM-DD`. Shows "Last updated" and sets `dateModified` in structured data. Cannot be earlier than `publishedAt`. |
| `author` | Defaults to `Samaat Editorial Team`. Only name a real person who actually wrote and stands behind the article. |
| `category` | Free text, e.g. `Buying Guides`. Creates `/category/buying-guides`. Add a blurb for a new category in `lib/posts.ts` under `CATEGORY_DESCRIPTIONS`. |
| `featuredImage` | Absolute URL. Used on cards, in the article, and in Open Graph metadata. |
| `featuredImageAlt` | Alt text for the featured image. Falls back to the title, but write it properly. |
| `tags` | List, used for related-article matching and as `keywords`. |
| `draft` | `true` hides the post in production: no page, no listing, no sitemap entry. It is still visible when running `npm run dev`. |

## What the build rejects

Malformed content fails the build with the file name and the reason. It will not
publish silently.

- A missing or empty `title`, `description`, `slug`, or `publishedAt`.
- A slug that is not lowercase-with-hyphens, or that collides with another post.
- An unparseable date, or an `updatedAt` earlier than `publishedAt`.
- A description longer than 320 characters.
- An empty body.

Run `npm run check:content` to check everything before you commit.

## Writing rules

- One `<h1>` per article: the title from the frontmatter. Use `##` and `###` in the body.
- Write the description as a promise of what the reader gets, not a keyword list.
- Link to other articles with `/blog/<slug>` and to categories with `/category/<slug>`.
- Use tables for comparisons and bullet lists for steps.
- Do not paste keyword-stuffed paragraphs. Article text is rendered into the HTML that Google reads.
- Prices and clinical claims must be accurate as of the date you publish. Say so if a figure is an estimate.

## Publishing

```bash
git add content/blog/your-new-post.md
git commit -m "blog: add <post title>"
git push
```

The host rebuilds on every push to the default branch. Nothing else to do.

## For an automation

Anything that can write a file and push to Git can publish. The minimum valid
file is frontmatter plus a Markdown body:

```bash
# 1. write the file
cat > content/blog/my-new-post.md <<'MD'
---
title: "My new post"
description: "A description between 150 and 160 characters that tells the reader what they will learn from this article."
slug: my-new-post
publishedAt: 2026-09-21
category: Buying Guides
---

## First section

Article text.
MD

# 2. validate, commit, push
npm run check:content
git add content/blog/my-new-post.md
git commit -m "blog: add my-new-post"
git push
```

The automation needs no CMS credentials, no database access, and no deployment
token. It only needs write access to this repository.
