# Deployment

The blog is a plain Next.js application. It has no database, no CMS, and no
runtime API calls, so any host that builds Next.js will do.

## Build settings

| Setting | Value |
| :--- | :--- |
| Install command | `npm install` |
| Build command | `npm run build` |
| Start command | `npm run start` (or the host's Next.js default) |
| Production branch | `main` |
| Node version | 20 or 22 |

The host rebuilds on every push to `main`, which is what makes the publishing
loop automatic.

## Environment variables

Set these in the host's dashboard. `SITE_URL` matters most: it is the base for
canonical URLs, Open Graph URLs, and the sitemap. Get it wrong and search
engines will be told the wrong address.

| Variable | Default | Notes |
| :--- | :--- | :--- |
| `SITE_URL` | `https://samaat.pk` | No trailing slash. |
| `SITE_NAME` | `Samaat.pk` | Used in titles and structured data. |
| `SITE_DESCRIPTION` | hearing health guides line | Home page and default description. |
| `SITE_AUTHOR` | `Samaat Editorial Team` | Default article author. |
| `SITE_LOGO` | `/samaat-logo.png` | Path in `public/` or an absolute URL. |
| `SITE_SOCIAL_IMAGE` | `/opengraph-image.jpg` | Default share image. |
| `SITE_STOREFRONT_URL` | `https://samaat.pk` | Where "Shop hearing aids" points. |
| `SITE_WHATSAPP` | `https://wa.me/923390000929` | Contact link in the header and articles. |
| `SITE_CONTACT_EMAIL` | `hello@samaat.pk` | Shown in the footer. |
| `SITE_TWITTER` | `@samaatpk` | Twitter card handle. |
| `SHOW_DRAFTS` | unset | Set to `true` on a preview deployment only, never in production. |

## Domain

Point the domain or subdomain at the host and add it as a custom domain. If the
blog lives at `blog.samaat.pk`, set `SITE_URL=https://blog.samaat.pk` so
canonicals and the sitemap point there.

## Deploying the same code as a second site

Copy the repository, change the environment variables, point a new domain at it.
There is nothing else to change: no hard-coded domain, no shared database, no
shared CMS.

## Post-deploy checks

1. `https://<domain>/robots.txt` advertises the sitemap.
2. `https://<domain>/sitemap.xml` lists the blog index, categories, and articles.
3. An article URL returns 200 and contains the article text in the HTML source
   (view source, not just the rendered page).
4. A nonexistent slug returns 404, not a 200 page.
5. Draft posts do not appear anywhere.
