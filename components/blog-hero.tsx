import { site } from "@/lib/site"

/**
 * The dark hero the storefront blog uses, minus the client component wrapper.
 * Headline wording stays generic so the same hero works for any deployment.
 */
export default function BlogHero({
  eyebrow,
  title,
  accent,
  subtitle,
}: {
  eyebrow?: string
  title: string
  accent?: string
  subtitle: string
}) {
  return (
    <div className="relative w-full overflow-hidden bg-[#12181d]">
      <div className="content-container relative z-10 py-16 small:py-24">
        <div className="mx-auto max-w-4xl text-center text-white">
          <div className="mb-6 flex flex-col gap-4">
            {eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                {eyebrow}
              </p>
            )}
            <h1 className="text-[40px] font-bold leading-tight small:text-[64px]">
              {title}
              {accent && <span className="block text-emerald-400">{accent}</span>}
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-relaxed text-grey-30 small:text-lg">
              {subtitle}
            </p>
          </div>
          <p className="text-sm text-grey-40">
            Published by {site.author}
          </p>
        </div>
      </div>
    </div>
  )
}