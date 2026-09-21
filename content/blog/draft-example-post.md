---
title: "Draft example: how to use the draft flag"
description: "A template post kept in draft state. It demonstrates that draft content never reaches production pages or the sitemap."
slug: draft-example-post
publishedAt: 2026-09-22
author: Samaat Editorial Team
category: Buying Guides
featuredImage: https://images.unsplash.com/photo-1596088869451-491e167efabb?auto=format&fit=crop&w=1200&q=80
featuredImageAlt: Hearing aid on a dark background
tags: ["internal", "template"]
draft: true
---

This file exists to prove how drafts behave. It is committed to the repository, so
you can see it while running `npm run dev`, and it is invisible in a production
build: no article page, no entry in `/blog`, no line in `sitemap.xml`.

When you are ready to publish, delete the `draft: true` line, set the real
`publishedAt` date, and push. The next deployment picks it up automatically.

Use this file as a starting point for new posts:

1. Rename it to match your slug.
2. Fill in title, description, slug, and publishedAt.
3. Write the article.
4. Remove `draft: true` when it is ready to go live.